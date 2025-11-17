import { useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Chip from '@mui/material/Chip';
import type { selectedBlock } from '../../types/horario'
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
    professionalData: Profesional;
    isProfessional: boolean;
    selectedDay: string | null;
}

const DateChips = (props: Props) => {
    const { userId, professionalData, isProfessional, selectedDay } = props;
    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<selectedBlock | null>(null) 
    const [showDateInfoModal, setShowDateInfoModal] = useState<boolean>(false)

    dayjs.locale('es'); // Establece el idioma español para dayjs

    // Funcion para manejar el click en un bloque
    const handleChipClick = (bloque: selectedBlock) => {
        setSelectedScheduleBlock(bloque);
        console.log("Bloque seleccionado: ", bloque);
        setShowDateInfoModal(true);
    }

    // // Función para mostrar la hora en formato HH:MM, calcula la posición del bloque y la hora de inicio}
    const generarChips = () => {
        const chips = [];
        const chipsData: selectedBlock[] = [];
        const duracionBloque = 60 / professionalData.disponibility.blocksPerHour; // Duración de cada bloque en minutos

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
                    userId: userId,
                    professionalId: professionalData.id,
                    day: selectedDay || professionalData.disponibility.days[0],
                    startHour: startHour,
                    endHour: endHour,
                    blockHour: bloque,
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
                    professionalData={professionalData}
                    isProfessional={isProfessional}
                    setOpen={setShowDateInfoModal}
                    selectedScheduleBlock={selectedScheduleBlock}
                    selectedDay={dayjs(selectedDay).format('dddd D [de] MMMM [de] YYYY')}
                />
            )}
        </>
    )
};

export default DateChips;