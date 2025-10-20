import { useEffect, useState } from 'react';
import userServices from '../../services/client'
import type { User } from '../../types/user';
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
    professionalId: number;
}

const InfoProfesional = (props: Props) => {
    const { professionalId } = props;
    const [info, setInfo] = useState<User | null>(null);
    const [scheduleInfo, setScheduleInfo] = useState<profesionalSchedule | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const data = await userServices.getUserById(professionalId);
            setInfo(data);
            setScheduleInfo(data?.schedule || null);
        };
        fetchInfo();
    }, [professionalId]);

    return (
        <div style={infoStyle}>
            <PersonIcon sx={{ fontSize: 200, color: 'black' }} />
            <p>Nombre: {info?.name}</p>
            <p>Rol: {info?.role}</p>
            <p>Atiende: {scheduleInfo?.days.map((item) => (item)).join(', ')}</p>
            <p>Horario: {scheduleInfo?.startHour} hrs - {scheduleInfo?.endHour} hrs</p>
            <p>Duracion de cita: {60 / (scheduleInfo?.blocksPerHour ?? 1)} minutos</p>
        </div>
    );
};

export default InfoProfesional;