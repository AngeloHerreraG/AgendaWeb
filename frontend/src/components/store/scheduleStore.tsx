import { create } from "zustand";
import scheduleService from "../../services/schedule";
import userService from "../../services/user";
import professionalService from "../../services/professional";
import type { SelectedBlock, BlockStatus, Schedule, ProfessionalSchedule } from "../../types/horario"; 
import type { Professional } from "../../types/user";

/**
 * Define los posibles estados de la carga de los chips/bloques.
 * - 'idle': Aún no se ha seleccionado un día.
 * - 'loading': Cargando los chips (al seleccionar un día).
 * - 'success': Los chips se cargaron correctamente.
 * - 'error': Hubo un error al cargar los chips.
 */
export type ScheduleStatus = "idle" | "loading" | "success" | "error";

/*
Aca guardaremos los datos globales para que pueda funionar la agenda
Solamente los globales, no por ejemplo el selectedDay, que es local
*/
interface ScheduleStore {
    // Profesional seleccionado
    professionalData: Professional | null;
    // Lista de horarios disponibles
    scheduleData: Schedule[]; 
    // Dia seleccionado para ver los bloques de horario
    selectedDay: string | null;
    // Estado de la carga de los horarios
    scheduleStatus: ScheduleStatus; 
    // Accion para setear el dia seleccionado
    setSelectedDay: (day: string | null) => void;
    // Acción para obtener los datos del profesional y su schedule
    fetchHorarioData: (professionalId: string) => Promise<void>;
    // Accion para actualizar los datos del horario del profesional
    updateDisponibility: (newDisponibility: ProfessionalSchedule) => Promise<ProfessionalSchedule>;
    // Acción para actualizar el estado de un bloque de horario, esto incluye el crear y modificar
    updateScheduleStatus: (scheduleBlock: SelectedBlock, newStatus: BlockStatus) => Promise<{status: number, message: string}>;
    // Acción para eliminar un bloque de horario
    deleteScheduleBlock: (scheduleBlock: SelectedBlock) => Promise<void>; 
    // Acción para limpiar los horarios del store al cambiar entre profesionales
    clearHorarioData: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
    professionalData: null,
    selectedDay: null,
    scheduleData: [],
    scheduleStatus: "idle",

    setSelectedDay: (day: string | null) => {
        set({ selectedDay: day });
    },

    fetchHorarioData: async (professionalId: string) => {
        set({ scheduleStatus: "loading" });
        try {
            const professionalData = await userService.getUserById(professionalId);
            if (professionalData?.role === 'professional') {
                set({ professionalData: professionalData });
            } else {
                set({ professionalData: null });
            }
        } catch (error) {
            console.error("Error fetching professional data:", error);
            set({ professionalData: null });
        }
        try {
            const schedule = await scheduleService.getProfessionalSchedule(professionalId);
            set({ scheduleData: schedule, scheduleStatus: "success" });
        } catch (error) {
            console.error("Error fetching schedules:", error);
            set({ scheduleData: [], scheduleStatus: "error" });
        }
    },

    updateDisponibility: async (newDisponibility: ProfessionalSchedule) => {
        const professionalData = get().professionalData;
        if (professionalData?.role !== 'professional') {
            throw new Error("El usuario no es un profesional");
        }
        try {
            // Chequeamos que la hora de inicio sea menor a la de fin
            if (newDisponibility.startHour >= newDisponibility.endHour || newDisponibility.endHour < newDisponibility.startHour || newDisponibility.startHour < 0 || newDisponibility.endHour > 24) {
                throw new Error("Horario inválido: La hora de inicio debe ser menor que la hora de fin y estar entre 0 y 24.");
            }
            // Chequeamos que haya al menos un dia seleccionado
            if (newDisponibility.days.length === 0) {
                throw new Error("Debe seleccionar al menos un día");
            }
            // Chequeamos que los bloques por hora sean válidos
            if (![1, 2, 3, 4, 6].includes(newDisponibility.blocksPerHour)) {
                throw new Error("Bloques por hora inválidos");
            }
            await professionalService.updateProfessionalSchedule(professionalData.id, newDisponibility);
            set({ professionalData: { ...professionalData, disponibility: newDisponibility } });
            return newDisponibility;
        } catch (error) {
            console.error("Error updating availability:", error);
            throw error;
        }
    },

    // Aca veremos si ya existe el bloque, si existe lo actualizamos, si no, lo creamos
    updateScheduleStatus: async (scheduleBlock: SelectedBlock, newStatus: BlockStatus) => {
        try {
            // Verificamos si el bloque ya existe en el store
            const existingBlock = await scheduleService.getSchedule(scheduleBlock.id);
            let updatedSchedule: Schedule;

            if (existingBlock) {
                // Si existe, actualizamos el bloque
                updatedSchedule = await scheduleService.updateScheduleBlock(scheduleBlock, newStatus);
                // Recorremos los horarios y actualizamos el bloque modificado
                const scheduleData = get().scheduleData.map(sch => 
                    sch.id === updatedSchedule.id ? updatedSchedule : sch
                );
                set({ scheduleData });
                // Retornamos un status 200 para indicar que fue una actualización
                return {status: 200, message: "Bloque actualizado correctamente."};
            }
            else {
                // Si no existe, creamos un nuevo bloque
                updatedSchedule = await scheduleService.createScheduleBlock(scheduleBlock, newStatus);
                // Y lo agregamos al estado del store
                set(state => ({ scheduleData: [...state.scheduleData, updatedSchedule] }));
                // Retornamos un status 201 para indicar que fue una creación
                return {status: 201, message:"Bloque creado correctamente."};
            }
        } catch (error) {
            console.error("Error updating schedule block:", error);
            throw error;
        }
    },

    deleteScheduleBlock: async (scheduleBlock: SelectedBlock) => {
        try {
            // Eliminamos el bloque de horario usando el servicio
            await scheduleService.deleteScheduleBlock(scheduleBlock.id);
            // Y actualizamos el estado del store removiendo el bloque eliminado
            const scheduleData = get().scheduleData.filter(sch => sch.id !== scheduleBlock.id);
            set({ scheduleData });
        } catch (error) {
            console.error("Error deleting schedule block:", error);
        }
    },

    clearHorarioData: () => {
        set({ scheduleData: [], professionalData: null, selectedDay: null, scheduleStatus: "idle" });
    },
}));