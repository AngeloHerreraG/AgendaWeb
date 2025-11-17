import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

import type { Professional } from '../types/user';
import type { professionalSchedule } from '../types/horario';

const baseUrl = "/api/professionals";

const createProfessional = async (newProfessional: Omit<Professional, 'id' | 'role'>) => {
    const response = await axiosSecure.post<Professional>(`${baseUrl}`, newProfessional);
    return response.data;
};

const updateProfessionalSchedule = async (professionalId: string, disponibility: professionalSchedule) => {
    const response = await axiosSecure.patch<professionalSchedule>(`${baseUrl}/schedule/${professionalId}`, { disponibility });
    return response;
};

const updateProfessionalInfo = async (professionalId: string, updatedInfo: Partial<Professional>) => {
    const response = await axiosSecure.patch<Professional>(`${baseUrl}/info/${professionalId}`, updatedInfo);
    return response;
}

const getAllProfessionals = async () => {
    const response = await axios.get<Professional[]>(`${baseUrl}`, { params: { role: 'professional' } });
    return response.data;
}

const deleteProfessional = async (id: number) => {
    const response = await axiosSecure.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createProfessional, updateProfessionalSchedule, updateProfessionalInfo, getAllProfessionals, deleteProfessional };