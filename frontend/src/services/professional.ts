import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

import type { Profesional } from '../types/user';
import type { profesionalSchedule } from '../types/horario';

const baseUrl = "/api/profesionals";

const createProfesional = async (newProfesional: Omit<Profesional, 'id' | 'role'>) => {
    const response = await axiosSecure.post<Profesional>(`${baseUrl}`, newProfesional);
    return response.data;
};

const updateProfesionalSchedule = async (profesionalId: string, schedule: profesionalSchedule) => {
    const response = await axiosSecure.patch<profesionalSchedule>(`${baseUrl}/${profesionalId}`, { schedule });
    return response.data;
};

const updateProfessionalInfo = async (profesionalId: string, updatedInfo: Partial<Profesional>) => {
    const response = await axiosSecure.patch<Profesional>(`${baseUrl}/info/${profesionalId}`, updatedInfo);
    return response;
}

const getAllProfesionals = async () => {
    const response = await axios.get<Profesional[]>(`${baseUrl}`, { params: { role: 'profesional' } });
    return response.data;
}

const deleteProfesional = async (id: number) => {
    const response = await axiosSecure.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createProfesional, updateProfesionalSchedule, updateProfessionalInfo, getAllProfesionals, deleteProfesional };