import axios from 'axios';
import type { User } from '../types/user';
const baseUrl = '/api/users';

const getUserById = async (id: string) => {
    const response = await axios.get<User>(`${baseUrl}/${id}`);
    return response.data ?? null;
};

export default { getUserById };