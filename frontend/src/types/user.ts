import type { professionalSchedule, Schedule } from "./horario";

export type UserRole = 'client' | 'professional' | 'admin';

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

export interface Professional extends BaseUser {
    role: 'professional';
    speciality: string;
    description: string;
    interests?: string[];
    disponibility: professionalSchedule;
}

export interface Admin extends BaseUser {
    role: 'admin';
}

export type User = Client | Professional | Admin;