import axios from "axios";

import type { User } from '../types/user';

const baseUrl = "http://localhost:9002";

const createUser = (newUser: Omit<User, 'id'>) => {
    const response = axios.post<User>(`${baseUrl}/users`, newUser);
    return response.then(res => res.data);
};

const getUserById = (id: number) => {
    const response = axios.get<User>(`${baseUrl}/users/${id}`);
    return response.then(res => res.data ?? null);
}

const getUserByUsername = (username: string) => {
    const response = axios.get<User[]>(`${baseUrl}/users`, { params: { name: username } });
    return response.then(res => res.data[0] ?? null);
}

const getAllUsers = () => {
    const response = axios.get<User[]>(`${baseUrl}/users`);
    return response.then(res => res.data);
}

const getAllDoctors = () => {
    const response = axios.get<User[]>(`${baseUrl}/users`, { params: { role: 'doctor' } });
    return response.then(res => res.data);
}

const deleteUser = (id: number) => {
    const response = axios.delete(`${baseUrl}/${id}`);
    return response.then(res => res.data);
};

export default { createUser, getUserById, getUserByUsername, getAllUsers, getAllDoctors, deleteUser };