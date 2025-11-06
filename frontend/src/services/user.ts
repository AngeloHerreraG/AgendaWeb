import axios from 'axios';
import type { User } from '../types/user';
const baseUrl = '/api/users';

const getUserById = async (id: string) => {
    const response = await axios.get<User>(`${baseUrl}/${id}`);
    return response.data ?? null;
};

const getUserByEmail = async (email: string) => {
    const response = await axios.post<{ message: string }>(`${baseUrl}/exists`, { email });
    return response.data;
}

const getUserSchedule = async (id: string) => {
    const response = await axios.get(`${baseUrl}/${id}/schedule`);
    return response.data ?? null;
};

export default { getUserById, getUserByEmail, getUserSchedule };