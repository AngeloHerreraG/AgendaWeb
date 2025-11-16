import axios from "axios";

import type { Client } from '../types/user';
import type { profesionalSchedule } from '../types/horario';

const baseUrl = "/api/clients";

const createClient = async (newClient: Omit<Client, 'id' | 'role'>) => {
    const response = await axios.post<Client>(`${baseUrl}`, newClient);
    return response.data;
};

const getClientById = async (id: string) => {
    const response = await axios.get<Client>(`${baseUrl}/${id}`);
    return response.data ?? null;
}

const getClientByEmail = async (email: string) => {
    const response = await axios.post<Client>(`${baseUrl}/exists`, { email });
    return response.data ?? null;
}

const getClientSchedule = async (clientId: string) => {
    const response = await axios.get<Client>(`${baseUrl}/${clientId}`);
    return response.data.schedule ?? null;
}

const updateClientSchedule = async (clientId: string, schedule: profesionalSchedule) => {
    const response = await axios.patch<Client>(`${baseUrl}/${clientId}`, { schedule });
    return response.data;
};

const updateClientInfo = async (clientId: string, updatedInfo: Partial<Client>) => {
    const response = await axios.patch<Client>(`${baseUrl}/info/${clientId}`, updatedInfo);
    return response;
}

const getClientByUsername = async (username: string) => {
    const response = await axios.get<Client[]>(`${baseUrl}`, { params: { name: username } });
    return response.data[0] ?? null;
}

const getAllClients = async () => {
    const response = await axios.get<Client[]>(`${baseUrl}`);
    return response.data;
}

const deleteClient = async (id: number) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createClient, getClientById, getClientSchedule, updateClientSchedule, updateClientInfo, getClientByUsername, 
    getAllClients, deleteClient, getClientByEmail
 };