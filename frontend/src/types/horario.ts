// Estados posibles de un bloque de horario
export type BlockStatus = 'pending' | 'confirmed' | 'cancelled' | 'blocked';

// Interfaz que define la estructura del contenido de un bloque antes de ser formateado
export interface selectedBlock {
    id: string;
    userId: string;
    professionalId: string;
    day: string;
    startHour: string;    // Hora de inicio en formato 24 horas (0-23)
    endHour: string;      // Hora de fin en formato 24 horas (0-23)
    blockHour: number;    // Bloque de la hora (0, 15, 30, 45), (0, 20, 40), (0, 30)
    state?: BlockStatus;
}

// Interfaz que define la estructura de un bloque de horario
export interface Schedule {
    id: string;
    userId: string;
    profesionalId: string;
    day: string;
    startHour: string;
    endHour: string;
    status: BlockStatus;
}

// Interfaz que define la estructura del horario de un profesional
export interface profesionalSchedule {
    days: string[];
    blocksPerHour: number;
    startHour: number;
    endHour: number;
}