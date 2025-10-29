import axios from "axios";

import type { Profesional } from '../types/user';
import type { profesionalSchedule } from '../types/horario';

const baseUrl = "/api/profesionals";

const createProfesional = async (newProfesional: Omit<Profesional, 'id' | 'role'>) => {
    const response = await axios.post<Profesional>(`${baseUrl}`, newProfesional);
    return response.data;
};

const updateProfesionalSchedule = async (profesionalId: string, schedule: profesionalSchedule) => {
    const response = await axios.patch<profesionalSchedule>(`${baseUrl}/${profesionalId}`, { schedule });
    return response.data;
};

const getAllProfesionals = async () => {
    const response = await axios.get<Profesional[]>(`${baseUrl}`, { params: { role: 'profesional' } });
    return response.data;
}

const deleteProfesional = async (id: number) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createProfesional, updateProfesionalSchedule, getAllProfesionals, deleteProfesional };