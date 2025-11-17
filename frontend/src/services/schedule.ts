import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { Schedule, selectedBlock } from '../types/horario';

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
const createScheduleBlock = async (scheduleBlock: selectedBlock, status: 'pending') => {
    const request = await axiosSecure.post<Schedule>(`${baseUrl}`, { scheduleBlock, status });
    return request;
}

// Actualizar un bloque de horario
const updateScheduleBlock = async (scheduleBlock: selectedBlock, newStatus: 'confirmed' | 'cancelled' | 'blocked') => {
    const request = await axiosSecure.patch<Schedule>(`${baseUrl}`, { scheduleBlock, status: newStatus });
    return request;
}

export default { getClientSchedule, getProfesionalSchedule, createScheduleBlock, updateScheduleBlock };