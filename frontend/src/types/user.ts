import type { profesionalSchedule, Schedule } from "./horario";

export type UserRole = 'client' | 'profesional' | 'admin';

interface BaseUser {
    id: string;
    name: string;
    email: string;
    password: string;
    birthDate: string;
    schedule?: Schedule[];
}

export interface Client extends BaseUser {
    role: 'client';
}

export interface Profesional extends BaseUser {
    role: 'profesional';
    speciality: string;
    description: string;
    interests?: string[];
    disponibility?: profesionalSchedule;
}

export interface Admin extends BaseUser {
    role: 'admin';
}

export type User = Client | Profesional | Admin;