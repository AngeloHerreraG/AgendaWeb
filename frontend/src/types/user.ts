import type { profesionalSchedule } from "./horario";
// Interfaz que define la estructura de un usuario
type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
    id: number
    name: string
    email: string
    password: string
    birthDate: string
    schedule?: profesionalSchedule
    role: UserRole
}

export interface Client extends User {
    role: 'patient'
}

export interface Doctor extends User {
    role: 'doctor'
    speciality: string
    description: string
    interests?: string[]
}