// Interfaz que define la estructura de un usuario
type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
    id: number
    name: string
    password: string
    role: UserRole
}

export type { User };