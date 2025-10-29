import axios from "axios";

import type { Profesional } from '../types/user';
import type { profesionalSchedule } from '../types/horario';

const baseUrl = "/api/profesionals";

const createProfesional = async (newProfesional: Omit<Profesional, 'id' | 'role'>) => {
    const response = await axios.post<Profesional>(`${baseUrl}`, newProfesional);
    return response.data;
};

const getProfesionalById = async (id: string) => {
    const response = await axios.get<Profesional>(`${baseUrl}/${id}`);
    return response.data ?? null;
}

const getProfesionalByEmail = async (email: string) => {
    const response = await axios.post<Profesional>(`${baseUrl}/exists`, { email });
    return response.data ?? null;
}

const getProfesionalSchedule = async (profesionalId: string) => {
    const response = await axios.get<Profesional>(`${baseUrl}/${profesionalId}`);
    const schedule: profesionalSchedule = response.data.disponibility!;
    return schedule ?? null;
}

const updateProfesionalSchedule = async (profesionalId: string, schedule: profesionalSchedule) => {
    const response = await axios.patch<profesionalSchedule>(`${baseUrl}/${profesionalId}`, { schedule });
    return response.data;
};

const getProfesionalByUsername = async (username: string) => {
    const response = await axios.get<Profesional[]>(`${baseUrl}`, { params: { name: username } });
    return response.data[0] ?? null;
}

const getAllProfesionals = async () => {
    const response = await axios.get<Profesional[]>(`${baseUrl}`, { params: { role: 'profesional' } });
    return response.data;
}

const deleteProfesional = async (id: number) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createProfesional, getProfesionalById, getProfesionalSchedule, updateProfesionalSchedule, getProfesionalByUsername, 
    getAllProfesionals, deleteProfesional, getProfesionalByEmail
};