import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { User } from "../types/user";

export type Credentials = {
    email: string;
    password: string;
};

const login = async (credentials: Credentials): Promise<User> => {
    const response = await axiosSecure.post("/api/login", credentials);
    const csrfToken = response.headers["x-csrf-token"];

    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }

    return response.data;
};

const restoreLogin = async (): Promise<User | null> => {
    try {
        const response = await axiosSecure.get("/api/login/me");
        return response.data;
    } catch {
        return null;
    }
};

const logout = async () => {
    await axios.post("/api/login/logout");
    localStorage.removeItem("csrfToken");
};

export default { login, restoreLogin, logout };
