import { useEffect, useState } from 'react'
import horarioServices from '../services/horario'
import type { HorarioType, HorarioProps, Bloque } from '../types/horario'
import '../styles/horario.css'

// Configuración del horario, mas adelante podriamos hacer que el profesional escoja estos datos
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const bloquesxhora = 3 // 20 minutos por bloque
const horainicio = 10 // 10 AM
const horafin = 18   // 6 PM

const HorarioComponent = (props: HorarioProps) => {
    const { userId, professionalId, isProfessional } = props
    const [horario, setHorario] = useState<HorarioType | null>(null)

    // Iremos actualizando periodicamente el horario
    useEffect(() => {
        if (!professionalId) {
            return;
        }

        // Función para obtener el horario
        const fetchHorario = async () => {
            const data = await horarioServices.createGetHorario({
                profesionalId: professionalId,
                dias: dias,
                bloquexhora: bloquesxhora,
                horainicio: horainicio,
                horafin: horafin
            });

            setHorario(data);
        };

        // LLamada inicial
        fetchHorario();

        // Lo iremos recargando cada 5 segundos
        const interval = setInterval(fetchHorario, 5000);
        return () => clearInterval(interval);

    }, [professionalId]);

    // Para evitar renderizar si no tenemos el horario
    if (!horario){
        return <div>Cargando horario...</div>
    }
    
    // Calculo del total de bloques
    const totalBloques = 1 + (horario.horafin - horario.horainicio) * horario.bloquexhora;

    // Función para obtener el estado de la celda
    const obtenerBloque = (fila: number, col: number) => {
        return horario.disponibilidad.find(b => b.dia === col && b.inicio === fila);
    };

    // Funcion para darle estilo a cada bloque
    const getBlockStyle = (bloque: Bloque | undefined) => {
        if (!bloque) return 'free';
        if (bloque.ocupadoProfesional && !isProfessional) return 'blocked-user';
        if (bloque.ocupadoProfesional) return 'blocked';
        if (bloque.ocupadoPaciente) return 'booked';
        return 'free';
    };

    // Función para manejar el click en un bloque, ya sea para reservar o bloquear la hora
    const toggleBloque = async (fila: number, col: number) => {
        // Para ser consistentes con la base de datos antes de hacer un put primero
        // obtenemos el horario actual y haremos merge de los cambios
        const horarioBD = await horarioServices.getHorario(professionalId);
        if (!horarioBD) return;
        const nuevaDisponibilidad = [...horarioBD.disponibilidad];

        // Buscar si el bloque ya existe
        const index = nuevaDisponibilidad.findIndex(b => b.dia === col && b.inicio === fila);

        // Si ya existe lo modificamos
        if (index >= 0) {
            // Tomamos la lista de bloques
            const bloque = { ...nuevaDisponibilidad[index] };
            // Si no es profesional pero esta ocupado por el profesional no puede reservar
            if (!isProfessional && bloque.ocupadoProfesional) {
                return;
            }
            // Si es profesional puede bloquear o desbloquear
            if (isProfessional) {
                bloque.ocupadoProfesional = !bloque.ocupadoProfesional;
            }
            // Si no, es paciente y puede reservar o desreservar
            else {
                bloque.ocupadoPaciente = !bloque.ocupadoPaciente;
                bloque.idPaciente = bloque.ocupadoPaciente ? userId : undefined;
            }
            // Si el bloque queda libre lo eliminamos
            if (!bloque.ocupadoProfesional && !bloque.ocupadoPaciente && !bloque.idPaciente) {
                nuevaDisponibilidad.splice(index, 1);
            } 
            // Si no, lo actualizamos
            else {
                nuevaDisponibilidad[index] = bloque;
            }
        }
        else {
            // Si no existe lo creamos
            const nuevoBloque: Bloque = {
                dia: col,
                inicio: fila,
                ocupadoProfesional: isProfessional ? true : false,
                ocupadoPaciente: isProfessional ? false : true,
                idPaciente: isProfessional ? undefined : userId
            };
            nuevaDisponibilidad.push(nuevoBloque);
        }

        const horarioActualizado = { ...horario, disponibilidad: nuevaDisponibilidad };
        setHorario(horarioActualizado);
        await horarioServices.updateHorario(horarioActualizado);
    };

    // Función para mostrar la hora en formato HH:MM, calcula la posición del bloque y la hora de inicio
    const mostrarHora = (bloqueIndex: number, horainicio: number, bloquexhora: number) => {
        const totalMinutos = horainicio * 60 + bloqueIndex * (60 / bloquexhora);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container">
            <h2>{!isProfessional && <span>Horario del Paciente {userId}</span>}</h2>
            <h2>Horario del Profesional {professionalId}</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Hora</th>
                        {dias.map((dia, index) => (
                            <th key={index}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: totalBloques }).map((_, fila) => (
                        <tr key={fila}>
                            <td className='hora'>{mostrarHora(fila, horainicio, bloquesxhora)}</td>
                            {dias.map((_, col) => {
                                const bloque = obtenerBloque(fila, col);
                                return (
                                    <td className={getBlockStyle(bloque)} key={col} onClick={() => toggleBloque(fila, col)}>
                                        {bloque ? (bloque.ocupadoProfesional ? 'Ocupado' : ((bloque && bloque.ocupadoPaciente) && 'Reservado')) : 'Libre'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HorarioComponent
