import axios from "axios";

import type { User } from '../types/user';

const baseUrl = "http://localhost:9002";

const createUser = (newUser: Omit<User, 'id'>) => {
    const response = axios.post<User>(`${baseUrl}/patients`, newUser);
    return response.then(res => res.data);
};

const getUserByUsername = (username: string) => {
    const response = axios.get<User[]>(`${baseUrl}/patients`, { params: { name: username } });
    return response.then(res => res.data[0] ?? null);
}

const getAllUsers = () => {
    const response = axios.get<User[]>(`${baseUrl}/patients`);
    return response.then(res => res.data);
}

const deleteUser = (id: number) => {
    const response = axios.delete(`${baseUrl}/${id}`);
    return response.then(res => res.data);
};

export default { createUser, getUserByUsername, getAllUsers, deleteUser };