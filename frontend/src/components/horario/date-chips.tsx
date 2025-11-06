import { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Chip from '@mui/material/Chip';
import scheduleServices from '../../services/schedule'
import userServices from '../../services/user'
import type { selectedBlock, Schedule, profesionalSchedule } from '../../types/horario'
import Appointment from './appointment'
import '../../styles/horario.css'
import type { Profesional } from '../../types/user';

const chipStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontSize: '1.5rem',
    width: '100%',
    height: '50px',
    padding: '0 10px',
    margin: '5px',
    cursor: 'pointer',
    border: "none",
    backgroundColor: "#d4e5ff",
    transitions: "all 0.3s ease",
    '&:hover': {
        backgroundColor: "#5170ff",
        color: "white",
        transform: "scale(1.05)"
    }
}

interface Props {
    userId: string;
    professionalId: string;
    selectedDay: string | null;
}

const DateChips = (props: Props) => {
    const { userId, professionalId, selectedDay } = props;

    const [profesionalScheduleData, setProfesionalScheduleData] = useState<profesionalSchedule | null>(null);
    const [profesionalData, setProfesionalData] = useState<Profesional | null>(null);
    const [horario, setHorario] = useState<Schedule[] | null>(null)

    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<selectedBlock | null>(null) 
    const [showDateInfoModal, setShowDateInfoModal] = useState<boolean>(false)

    dayjs.locale('es'); // Establece el idioma español para dayjs

    useEffect(() => {
        if (!professionalId) {
            return;
        }

        // Obtener datos del profesional
        const fetchProfesionalData = async () => {
            const user = await userServices.getUserById(professionalId);
            if (user.role === 'profesional') {
                setProfesionalData(user);
                setProfesionalScheduleData(user?.disponibility || null);
            }
        };

        // Función para obtener los horarios particulares del profesional
        const fetchHorario = async () => {
            const data = await scheduleServices.getProfesionalSchedule(professionalId);
            setHorario(data);
        };
        
        // LLamada inicial
        fetchProfesionalData();
        fetchHorario();
    }, [professionalId]);

    // Para evitar renderizar si no tenemos el horario
    if (!horario){
        return <div>Cargando horario...</div>
    }

    // Funcion para manejar el click en un bloque
    const handleChipClick = (bloque: selectedBlock) => {
        setSelectedScheduleBlock(bloque);
        console.log("Bloque seleccionado: ", bloque);
        setShowDateInfoModal(true);
    }

    // // Función para mostrar la hora en formato HH:MM, calcula la posición del bloque y la hora de inicio}
    const generarChips = () => {
        if (!profesionalScheduleData) 
            return (<div>Cargando horario...</div>)

        const chips = [];
        const chipsData: selectedBlock[] = [];
        const duracionBloque = 60 / profesionalScheduleData.blocksPerHour; // Duración de cada bloque en minutos

        for (let hora = profesionalScheduleData.startHour; hora < profesionalScheduleData.endHour; hora++) {
            for (let bloque = 0; bloque < profesionalScheduleData.blocksPerHour; bloque++) {
                const inicioMin = hora * 60 + bloque * duracionBloque;
                const finMin = inicioMin + duracionBloque;

                const formato = (h: number, m: number) =>
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

                const inicioHora = Math.floor(inicioMin / 60);
                const inicioMinuto = Math.floor(inicioMin % 60);
                const finHora = Math.floor(finMin / 60);
                const finMinuto = Math.floor(finMin % 60);

                const label = `${formato(inicioHora, inicioMinuto)} - ${formato(finHora, finMinuto)}`;
                chips.push(label);
                chipsData.push({ 
                    userId: userId,
                    professionalId: professionalId,
                    day: selectedDay || profesionalScheduleData.days[0],
                    startHour: inicioHora, 
                    endHour: finHora, 
                    blockHour: bloque,
                    label: label
                });
            }
        }

        return (
            <div className='horario-chips'>
                {chips.map((chip, index) => (
                    <div key={index}>
                        <Chip 
                            label={chip}
                            key={index} 
                            sx={chipStyle}
                            onClick={() => handleChipClick(chipsData[index])}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <h2> Bloques disponibles </h2>
            <p>Día: {selectedDay ? dayjs(selectedDay).format('dddd D [de] MMMM [de] YYYY') : 'No seleccionado'}</p>
            {selectedDay && generarChips()}
            {showDateInfoModal && selectedScheduleBlock && (
                <Appointment 
                    userId={userId}
                    professionalData={profesionalData!}
                    setOpen={setShowDateInfoModal}
                    selectedScheduleBlock={selectedScheduleBlock}
                    selectedDay={dayjs(selectedDay).format('dddd D [de] MMMM [de] YYYY')}
                />
            )}
        </>
    )
};


export default DateChips;