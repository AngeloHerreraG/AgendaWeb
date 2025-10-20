import { useEffect, useState } from 'react';
import profesionalServices from '../../services/profesional'
import type { Profesional, User } from '../../types/user';
import type { profesionalSchedule } from '../../types/horario';
import PersonIcon from '@mui/icons-material/Person';

const infoStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    padding: '8px',
}

interface Props {
    professionalId: string;
}

const InfoProfesional = (props: Props) => {
    const { professionalId } = props;
    const [info, setInfo] = useState<Profesional | null>(null);
    const [scheduleInfo, setScheduleInfo] = useState<profesionalSchedule | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await profesionalServices.getProfesionalById(professionalId);
            setInfo(data);
            setScheduleInfo(data?.disponibility || null);
            console.log(data.disponibility);
        };
        fetchInfo();
    }, [professionalId]);

    return (
        <div style={infoStyle}>
            <PersonIcon sx={{ fontSize: 200, color: 'black' }} />
            <p>Nombre: {info?.name}</p>
            <p>Atiende: {scheduleInfo?.days.map((item) => (item)).join(', ')}</p>
            <p>Horario: {scheduleInfo?.startHour} hrs - {scheduleInfo?.endHour} hrs</p>
            <p>Duracion de cita: {60 / (scheduleInfo?.blocksPerHour ?? 1)} minutos</p>
        </div>
    );
};

export default InfoProfesional;