import { useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Chip from '@mui/material/Chip';
import type { selectedBlock, BlockStatus } from '../../types/horario'
import Appointment from './appointment'
import '../../styles/horario.css'

import { useScheduleStore } from '../store/scheduleStore'


const chipStyle = {
    fontFamily: '"Poppins", sans-serif',
    fontSize: '1.5rem',
    width: '99%',
    height: '50px',
    padding: '0 10px',
    margin: '5px',
    cursor: 'pointer',
    border: "none",
    backgroundColor: "#d4e5ff",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    '&:hover': {
        backgroundColor: "#5170ff",
        color: "white",
    }
}

const pendingChipStyle = {
    border: '2px solid orange',
    backgroundColor: '#ffe591',
    // Sobrescribe el hover del estilo base
    '&:hover': {
        backgroundColor: 'orange',
        color: 'white'
    }
};

const confirmedChipStyle = {
    border: '2px solid lightseagreen',
    backgroundColor: '#a9f5ff',
    '&:hover': {
        backgroundColor: 'lightseagreen',
        color: 'white'
    }
};

const cancelledChipStyle = {
    border: '2px solid darkred',
    backgroundColor: '#ffa7b4',
    '&:hover': {
        backgroundColor: 'darkred',
        color: 'white'
    }
};

const blockedChipStyle = {
    border: '2px solid gray',
    backgroundColor: '#b3b3b3',
    '&:hover': {
        backgroundColor: 'gray',
        color: 'white'
    }
};

const getChipStyle = (status?: BlockStatus) => {
    if (!status) {
        return chipStyle;
    }
    switch (status) {
        case 'pendiente':
            return { ...chipStyle, ...pendingChipStyle };
        case 'confirmado':
            return { ...chipStyle, ...confirmedChipStyle };
        case 'cancelado':
            return { ...chipStyle, ...cancelledChipStyle };
        case 'bloqueado':
            return { ...chipStyle, ...blockedChipStyle };
        default:
            return chipStyle;
    }
}

interface Props {
    userId: string;
    isProfessional: boolean;
}

const DateChips = (props: Props) => {
    const { userId, isProfessional } = props;
    const { professionalData, scheduleData, selectedDay } = useScheduleStore();

    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<selectedBlock | null>(null) 
    const [showDateInfoModal, setShowDateInfoModal] = useState<boolean>(false)
    
    if (!professionalData) {
        return <div>Cargando bloques...</div>;
    }

    // Configuramos el locale de dayjs a español
    dayjs.locale('es');

    // Función para manejar el click en un bloque
    const handleChipClick = (bloque: selectedBlock, status?: BlockStatus) => {
        if (status) {
            bloque.state = status;
        }
        setSelectedScheduleBlock(bloque);
        setShowDateInfoModal(true);
    }

    // Función para mostrar la hora en formato HH:MM
    const generarChips = () => {
        const chips = [];
        const chipsData: selectedBlock[] = [];
        const chipState: [number, BlockStatus][] = [];
        const duracionBloque = 60 / professionalData.disponibility.blocksPerHour; // Duración de cada bloque en minutos

        // Ahora generamos los chips según la disponibilidad del profesional
        for (let hora = professionalData.disponibility.startHour; hora < professionalData.disponibility.endHour; hora++) {
            for (let bloque = 0; bloque < professionalData.disponibility.blocksPerHour; bloque++) {
                const inicioMin = hora * 60 + bloque * duracionBloque;
                const finMin = inicioMin + duracionBloque;

                const formato = (h: number, m: number) =>
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

                const inicioHora = Math.floor(inicioMin / 60);
                const inicioMinuto = Math.floor(inicioMin % 60);
                const finHora = Math.floor(finMin / 60);
                const finMinuto = Math.floor(finMin % 60);

                const startHour = `${formato(inicioHora, inicioMinuto)}`;
                const endHour = `${formato(finHora, finMinuto)}`;
                chips.push(`${startHour} - ${endHour}`);
                chipsData.push({ 
                    id: `${professionalData.id}-${selectedDay}-${startHour}-${endHour}`,
                    userId: userId,
                    professionalId: professionalData.id,
                    day: selectedDay || professionalData.disponibility.days[0],
                    startHour: startHour,
                    endHour: endHour,
                    blockHour: bloque,
                });
            }
        }

        // Y aca chequeamos segun los horarios ya agendados si hay un chip que tenga un estado
        // Revisamos los chipsData contra professionalSchedule y vemos si la id coincide
        // Si la id coincide, añadimos a la lista chipState el estado del bloque junto al indice del chip
        for (let i = 0; i < chipsData.length; i++) {
            const chip = chipsData[i];
            const scheduledBlock = scheduleData.find(sch => sch.id === chip.id);
            if (scheduledBlock) {
                chipState.push([i, scheduledBlock.status]);
            }
        }

        // Y ahora al momento de renderizar los chips, chequeamos si el indice del chip esta en chipState
        // Si esta, aplicamos el estilo segun el estado
        return (
            <div className='horario-chips'>
                {chips.map((chip, index) => (
                    <div key={chipsData[index].id}>
                        <Chip 
                            label={chip}
                            sx={getChipStyle(chipState.find(([i]) => i === index)?.[1])}
                            onClick={() => handleChipClick(chipsData[index], chipState.find(([i]) => i === index)?.[1])}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <h2> Bloques disponibles </h2>
            {!selectedDay ? (
                <p>Seleccione un día para ver los bloques disponibles.</p>
            ) : (
                <>
                    <p>Día: {dayjs(selectedDay).format('dddd D [de] MMMM [de] YYYY')}</p>
                    {generarChips()}
                </>
            )}
            {showDateInfoModal && selectedScheduleBlock && (
                <Appointment 
                    isProfessional={isProfessional}
                    setOpen={setShowDateInfoModal}
                    selectedScheduleBlock={selectedScheduleBlock}
                />
            )}
        </>
    )
};

export default DateChips;