import axios from "axios";
import type { Schedule, profesionalSchedule } from '../types/horario';
import userService from './client';

const baseUrl = "http://localhost:9002/schedules";

// En las funciones usamos async/await para manejar las llamadas asincronas
// y asi podemos usar try/catch en caso de error, el codigo es mas limpio
// y manejamos la respuesta directamente

// Obtener el horario de un profesional
const getProfesionalSchedule = async (profesionalId: number) => {
    const request = await userService.getUserSchedule(profesionalId);
    return request;
}

const getHorario = async (profesionalId: number) => {
    const request = await axios.get<Schedule[]>(`${baseUrl}`);
    return request.data.filter(schedule => schedule.profesionalId === profesionalId);
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

export default { getProfesionalSchedule, getHorario, createHorario, updateHorario };