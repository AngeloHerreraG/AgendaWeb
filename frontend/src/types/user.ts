import type { profesionalSchedule } from "./horario";
// Interfaz que define la estructura de un usuario
export type UserRole = 'client' | 'profesional' | 'admin';

export interface User {
    id: string
    name: string
    email: string
    password: string
    birthDate: string
    schedule?: profesionalSchedule
    role: UserRole
}

export interface Client extends User {
    role: 'client'
}

export interface Profesional extends User {
    role: 'profesional'
    speciality: string
    description: string
    interests?: string[]
}