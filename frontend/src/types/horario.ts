// Interfaz que define la estructura del contenido de un bloque antes de ser formateado
export interface selectedBlock {
    userId: string;
    professionalId: string;
    day: string;
    startHour: number;    // Hora de inicio en formato 24 horas (0-23)
    endHour: number;      // Hora de fin en formato 24 horas (0-23)
    blockHour: number;    // Bloque de la hora (0, 15, 30, 45), (0, 20, 40), (0, 30)
}

// Interfaz que define la estructura de un bloque de horario
export interface Schedule {
    id: string;
    profesionalId: string;
    userId: string;
    startDate: Date;
    finishDate: Date;
    status?: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
}

// Interfaz que define la estructura del horario de un profesional
export interface profesionalSchedule {
    days: string[];
    blocksPerHour: number;
    startHour: number;
    endHour: number;
}