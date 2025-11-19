import { create } from "zustand";

import loginServices from "../../services/login";
import userServices from "../../services/user";
import clientServices from "../../services/client";
import professionalServices from "../../services/professional";

import type { Credentials } from "../../services/login";
import type { Client, Professional, User } from "../../types/user";

// Definimos los posibles estados de autenticación para el store
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Definimos la interfaz del store de autenticación
interface AuthStore {
    // El usuario autenticado que navega en la aplicación
    user: User | null;
    // El estado de autenticación actual
    authStatus: AuthStatus;
    // Acción para verificar si el usuario está autenticado
    checkAuth: () => Promise<AuthStatus>;
    // Funcion para iniciar sesión
    login: (credentials: Credentials) => Promise<void>;
    // Funcion para cerrar sesión
    logout: () => Promise<void>;
    // Función para actualizar los datos del usuario si es que es cliente
    updateUserData: (newUserData: Partial<Client>) => Promise<Client>;
    // Función para actualizar los datos del usuario si es que es profesional
    updateProfessionalData: (newProfessionalData: Partial<Professional>) => Promise<Professional>;
}

// Creamos el store de autenticación usando Zustand
// Y definimos las acciones para manejar la autenticación y actualización de datos del usuario
export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    authStatus: "loading",

    checkAuth: async () => {
        try {
            const user: User | null = await loginServices.restoreLogin();
            if (!user) {
                set({ user: null,  authStatus: "unauthenticated" });
                return "unauthenticated";
            }
            set({ user, authStatus: "authenticated" });
            return "authenticated";
        }
        catch (error) {
            set({ user: null, authStatus: "unauthenticated" });
            console.error("No active session", error);
            return "unauthenticated";
        }
    },

    login: async (credentials: Credentials) => {
        try {
            // Primero realizamos el login para obtener los datos básicos del usuario
            // y tambien el token de sesión y las cookies
            const loginUserData: User = await loginServices.login(credentials);
            // Luego usamos el id del usuario para obtener sus datos completos
            const user = await userServices.getUserById(loginUserData.id);
            set({ user, authStatus: "authenticated" });
        } catch (error) {
            console.log("Login failed", error);
            set({ user: null, authStatus: "unauthenticated" });
            throw error;
        }
    },

    logout: async () => {
        await loginServices.logout().finally(() => {
            set({ user: null, authStatus: "unauthenticated" });
        });
    },

    updateUserData: async (newUserData: Partial<Client>) => {
        const user = get().user;
        if (!user) 
            throw new Error("No hay usuario autenticado");

        const updateUser = await clientServices.updateClientInfo(user.id, newUserData);
        set({ user: updateUser });
        return updateUser;
    },

    updateProfessionalData: async (newProfessionalData: Partial<Professional>) => {
        const user = get().user;
        if (!user || user.role !== 'professional') {
            throw new Error("El usuario no es un profesional");
        }
        const updatedProfessional = await professionalServices.updateProfessionalInfo(user.id, newProfessionalData);
        set({ user: updatedProfessional });
        return updatedProfessional;
    },
}));