import axios from "axios";

import type { Client } from '../types/user';
import type { ProfessionalSchedule, Schedule } from '../types/horario';

const baseUrl = "/api/clients";

const createClient = async (newClient: Partial<Client>): Promise<Client> => {
    const response = await axios.post<Client>(`${baseUrl}`, newClient);
    return response.data;
};

const getClientById = async (id: string): Promise<Client | null> => {
    const response = await axios.get<Client>(`${baseUrl}/${id}`);
    return response.data ?? null;
}

const getClientByEmail = async (email: string): Promise<Client | null> => {
    const response = await axios.post<Client>(`${baseUrl}/exists`, { email });
    return response.data ?? null;
}

const getClientSchedule = async (clientId: string): Promise<Schedule[] | null> => {
    const response = await axios.get<Client>(`${baseUrl}/${clientId}`);
    return response.data.schedule ?? null;
}

const updateClientSchedule = async (clientId: string, schedule: ProfessionalSchedule): Promise<Client> => {
    const response = await axios.patch<Client>(`${baseUrl}/${clientId}`, { schedule });
    return response.data;
};

const updateClientInfo = async (clientId: string, updatedInfo: Partial<Client>): Promise<Client> => {
    const response = await axios.patch<Client>(`${baseUrl}/info/${clientId}`, updatedInfo);
    return response.data;
}

const getClientByUsername = async (username: string): Promise<Client | null> => {
    const response = await axios.get<Client[]>(`${baseUrl}`, { params: { name: username } });
    return response.data[0] ?? null;
}

const getAllClients = async (): Promise<Client[]> => {
    const response = await axios.get<Client[]>(`${baseUrl}`);
    return response.data;
}

const deleteClient = async (id: number): Promise<void> => {
    const response = await axios.delete<void>(`${baseUrl}/${id}`);
    return response.data;
};

export default { createClient, getClientById, getClientSchedule, updateClientSchedule, updateClientInfo, getClientByUsername, 
    getAllClients, deleteClient, getClientByEmail
};