// Bloque de un horario
interface Bloque {
    dia: number       // indice del dia en dias[]
    inicio: number    // indice del bloque en el dia    
    ocupadoProfesional: boolean
    ocupadoPaciente: boolean
    idPaciente?: number
}

// Interfaz para el horario de un profesional
interface HorarioType {
    id: number
    profesionalId: number
    dias: string[]
    bloquexhora: number   // numero de bloques por hora, los valores posibles son 1, 2, 3 4 o 6
    horainicio: number    // hora de inicio del horario, en formato 24 horas y en punto solamente
    horafin: number       // hora de fin del horario, en formato 24 horas y en punto solamente
    disponibilidad: Bloque[]
}

// Interfaz para la creacion de un componente de horario
// Aca obviamos id y disponibilidad
interface HorarioConfig {
    profesionalId: number;
    dias: string[];
    bloquexhora: number;
    horainicio: number;
    horafin: number;
}

export type { HorarioType, Bloque, HorarioConfig };