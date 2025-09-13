import axios from "axios";
import type { HorarioConfig, HorarioType } from '../types/horario';

const baseUrl = "http://localhost:9002/horarios";
let creandoHorario: Promise<HorarioType> | null = null;

// En las funciones usamos async/await para manejar las llamadas asincronas
// y asi podemos usar try/catch en caso de error, el codigo es mas limpio
// y manejamos la respuesta directamente

// Obtener el horario de un profesional
const getHorario = async (profesionalId: number) => {
    const request = await axios.get<HorarioType[]>(`${baseUrl}`);
    const data: HorarioType[] = request.data;
    return data.find(horario => horario.profesionalId === profesionalId);
}

// Crear un nuevo horario e insertarlo en la base de datos
const createHorario = async (newHorario: HorarioConfig) => {
    const response = await axios.post<HorarioType>(`${baseUrl}`, { ...newHorario, disponibilidad: [] });
    return response.data;
}

// Funcion especial para crear el horario si no existe y obtenerlo, asi se evita crear varios horarios simultaneamente
// y dataraces
const createGetHorario = async (newHorario: HorarioConfig) => {
    if (creandoHorario) 
        return creandoHorario;

    creandoHorario = (async () => {
        let horario = await getHorario(newHorario.profesionalId);

        if (!horario) {
            horario = await createHorario(newHorario);
        }

        creandoHorario = null;
        return horario;
    })();

    return creandoHorario;
}

// Actualizar un horario existente, esto principalmente se usara para actualizar la disponibilidad
const updateHorario = async(newHorario: HorarioType) => {
    const request = await axios.put(`${baseUrl}/${newHorario.id}`, newHorario);
    return request.data;
}

export default { getHorario, createHorario, createGetHorario, updateHorario };