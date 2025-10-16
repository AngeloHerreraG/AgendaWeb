import axios from "axios";

import type { User } from '../types/user';
import type { profesionalSchedule } from '../types/horario';

const baseUrl = "http://localhost:9002/users";

const createUser = async (newUser: Omit<User, 'id'>) => {
    const response = await axios.post<User>(`${baseUrl}`, newUser);
    return response.data;
};

const getUserById = async (id: number) => {
    const response = await axios.get<User>(`${baseUrl}/${id}`);
    return response.data ?? null;
}

const getUserSchedule = async (userId: number) => {
    const response = await axios.get<User>(`${baseUrl}/${userId}`);
    return response.data.schedule ?? null;
}

const updateUserSchedule = async (userId: number, schedule: profesionalSchedule) => {
    const response = await axios.patch<User>(`${baseUrl}/${userId}`, { schedule });
    return response.data;
};

const getUserByUsername = async (username: string) => {
    const response = await axios.get<User[]>(`${baseUrl}`, { params: { name: username } });
    return response.data[0] ?? null;
}

const getAllUsers = async () => {
    const response = await axios.get<User[]>(`${baseUrl}`);
    return response.data;
}

const getAllDoctors = async () => {
    const response = await axios.get<User[]>(`${baseUrl}`, { params: { role: 'doctor' } });
    return response.data;
}

const deleteUser = async (id: number) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
};

export default { createUser, getUserById, getUserSchedule, updateUserSchedule, getUserByUsername, getAllUsers, getAllDoctors, deleteUser };