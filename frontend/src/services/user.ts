import axios from 'axios';
import type { User } from '../types/user';

const baseUrl = '/api/users';

const getUserById = async (id: string): Promise<User | null> => {
    const response = await axios.get<User>(`${baseUrl}/${id}`);
    return response.data ?? null;
};

const getUserByEmail = async (email: string): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${baseUrl}/exists`, { email });
    return response.data;
}


export default { getUserById, getUserByEmail };