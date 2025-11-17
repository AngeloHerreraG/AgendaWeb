import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { Schedule, selectedBlock } from '../types/horario';

const baseUrl = "/api/schedules";

// En las funciones usamos async/await para manejar las llamadas asincronas
// y asi podemos usar try/catch en caso de error, el codigo es mas limpio
// y manejamos la respuesta directamente

const getSchedule = async (scheduleId: string) => {
    const request = await axios.get<Schedule>(`${baseUrl}/${scheduleId}`);
    return request.data;
}

const getProfesionalSchedule = async (profesionalId: String) => {
    const request = await axios.get<Schedule[]>(`${baseUrl}/profesional/${profesionalId}`);
    return request.data;
}

// Crear un nuevo bloque de horario
const createScheduleBlock = async (scheduleBlock: selectedBlock, status: 'pending' | 'confirmed' | 'cancelled' | 'blocked') => {
    const request = await axiosSecure.post<Schedule>(`${baseUrl}`, { scheduleBlock, status });
    return request;
}

// Actualizar un bloque de horario
const updateScheduleBlock = async (scheduleBlock: selectedBlock, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'blocked') => {
    const scheduleId = scheduleBlock.id;
    if (!scheduleId) {
        throw new Error("Schedule ID is required to update a schedule block.");
    }
    const request = await axiosSecure.patch<Schedule>(`${baseUrl}/${scheduleId}`, { scheduleBlock, status: newStatus });
    return request;
}

export default { getSchedule, getProfesionalSchedule, createScheduleBlock, updateScheduleBlock };