import PersonIcon from '@mui/icons-material/Person';

import { useScheduleStore } from '../store/scheduleStore'


const infoStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    padding: '8px',
}

const InfoProfessional = () => {
    const {professionalData} = useScheduleStore();

    if (!professionalData) {
        return <div>Cargando información del profesional...</div>;
    }

    return (
        <div style={infoStyle}>
            <PersonIcon sx={{ fontSize: 200, color: 'black' }} />
            <p>Nombre: {professionalData.name}</p>
            <p>Atiende: {professionalData.disponibility?.days.map((item) => (item)).join(', ')}</p>
            <p>Horario: {professionalData.disponibility?.startHour} hrs - {professionalData.disponibility?.endHour} hrs</p>
            <p>Duracion de cita: {60 / (professionalData.disponibility?.blocksPerHour ?? 1)} minutos</p>
        </div>
    );
};

export default InfoProfessional;