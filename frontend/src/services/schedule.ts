import axios from "axios";
import type { Schedule } from '../types/horario';

const baseUrl = "/api/schedules";

// En las funciones usamos async/await para manejar las llamadas asincronas
// y asi podemos usar try/catch en caso de error, el codigo es mas limpio
// y manejamos la respuesta directamente

const getClientSchedule = async () => {
    const request = await axios.get<Schedule[]>(`${baseUrl}/my-schedules`);
    return request.data;
}

const getProfesionalSchedule = async (profesionalId: String) => {
    const request = await axios.get<Schedule[]>(`${baseUrl}/profesional/${profesionalId}`);
    return request.data;
}

// Crear un nuevo bloque de horario
const createHorario = async (newSchedule: Omit<Schedule, 'id'>) => {
    const request = await axios.post<Schedule>(`${baseUrl}`, newSchedule);
    return request.data;
}

// Actualizar un bloque de horario existente
const updateHorario = async(newSchedule: Schedule) => {
    const request = await axios.patch<Schedule>(`${baseUrl}/${newSchedule.id}`, newSchedule);
    return request.data;
}

export default { getClientSchedule, getProfesionalSchedule, createHorario, updateHorario };