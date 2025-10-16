import type { profesionalSchedule } from "./horario";
// Interfaz que define la estructura de un usuario
type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
    id: number
    name: string
    password: string
    role: UserRole
    schedule?: profesionalSchedule
}