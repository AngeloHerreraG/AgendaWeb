import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

import type { Professional } from '../types/user';
import type { professionalSchedule } from '../types/horario';

const baseUrl = "/api/professionals";

const createProfessional = async (newProfessional: Partial<Professional>): Promise<Professional> => {
    const response = await axiosSecure.post<Professional>(`${baseUrl}`, newProfessional);
    return response.data;
};

const updateProfessionalSchedule = async (professionalId: string, disponibility: professionalSchedule): Promise<professionalSchedule> => {
    const response = await axiosSecure.patch<professionalSchedule>(`${baseUrl}/schedule/${professionalId}`, { disponibility });
    return response.data;
};

const updateProfessionalInfo = async (professionalId: string, updatedInfo: Partial<Professional>): Promise<Professional> => {
    const response = await axiosSecure.patch<Professional>(`${baseUrl}/info/${professionalId}`, updatedInfo);
    return response.data;
}

const getAllProfessionals = async (): Promise<Professional[]> => {
    const response = await axios.get<Professional[]>(`${baseUrl}`, { params: { role: 'professional' } });
    return response.data;
}

const deleteProfessional = async (id: number): Promise<void> => {
    const response = await axiosSecure.delete<void>(`${baseUrl}/${id}`);
    return response.data;
};

export default { createProfessional, updateProfessionalSchedule, updateProfessionalInfo, getAllProfessionals, deleteProfessional };