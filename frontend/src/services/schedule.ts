import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { Schedule, selectedBlock, BlockStatus } from '../types/horario';

const baseUrl = "/api/schedules";

// En las funciones usamos async/await para manejar las llamadas asincronas
// y asi podemos usar try/catch en caso de error, el codigo es mas limpio
// y manejamos la respuesta directamente

const getSchedule = async (scheduleId: string): Promise<Schedule> => {
    const response = await axios.get<Schedule>(`${baseUrl}/${scheduleId}`);
    return response.data;
}

const getProfessionalSchedule = async (professionalId: string): Promise<Schedule[]> => {
    const response = await axios.get<Schedule[]>(`${baseUrl}/professional/${professionalId}`);
    return response.data;
}

// Crear un nuevo bloque de horario
const createScheduleBlock = async (scheduleBlock: selectedBlock, status: BlockStatus): Promise<Schedule> => {
    const response = await axiosSecure.post<Schedule>(`${baseUrl}`, { scheduleBlock, status });
    return response.data;
}

// Actualizar un bloque de horario
const updateScheduleBlock = async (scheduleBlock: selectedBlock, newStatus: BlockStatus): Promise<Schedule> => {
    const scheduleId = scheduleBlock.id;
    if (!scheduleId) {
        throw new Error("Schedule ID is required to update a schedule block.");
    }
    const response = await axiosSecure.patch<Schedule>(`${baseUrl}/${scheduleId}`, { scheduleBlock, status: newStatus });
    return response.data;
}

// Borrar un bloque de horario
const deleteScheduleBlock = async (scheduleId: string): Promise<void> => {
    const response = await axiosSecure.delete<void>(`${baseUrl}/${scheduleId}`);
    return response.data;
}

export default { getSchedule, getProfessionalSchedule, createScheduleBlock, updateScheduleBlock, deleteScheduleBlock };