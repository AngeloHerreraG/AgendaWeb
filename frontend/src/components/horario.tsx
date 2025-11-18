import { useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router'
import '../styles/horario.css'

import { useScheduleStore } from './store/scheduleStore'
import { useAuthStore } from './store/authStore'

import Navbar from './navbar'
import InfoProfessional from './horario/information'
import CalendarSelector from './horario/calendar';
import DateChips from './horario/date-chips';

import ScheduleForm from './forms/schedule-form';

const HorarioComponent = () => {
    const navigate = useNavigate();
    const professionalId = useParams().id;
    const {user: loggedUser, authStatus} = useAuthStore();
    const {professionalData, scheduleStatus, fetchHorarioData, clearHorarioData} = useScheduleStore();
    const isProfessional = loggedUser?.id === professionalId;

    useEffect(() => {
        const fetchProfessionalData = async () => {
            if (professionalId) {
                // Ahora el store se encarga de obtener tanto los datos del profesional como sus horarios
                // y de almacenarlos globalmente
                await fetchHorarioData(professionalId);
            }
        };
        
        fetchProfessionalData();

        // Limpiar los horarios al desmontar el componente
        return () => {
            clearHorarioData();
        }
    }, [professionalId, fetchHorarioData, clearHorarioData]);

    // Revisamos si el auth esta cargando aun
    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    // Si no esta loggeado, redirigir al login
    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to='/login' replace />;
    }

    if (!professionalData || scheduleStatus === "error") {
        return <div>Cargando datos del profesional...</div>;
    }

    // Funcion para volver al home
    const goHome = () => {
        return navigate(`/home/${loggedUser?.id}`);
    }

    const handleProfile = () => {
        return navigate(`/profile/${professionalId}`);
    }

    return (
        <div className='horario-container'>
            <Navbar userId={loggedUser.id} />
            <div className="horario-bg"></div>
            <div className='horario-button-container'>
                <button className='common-btn' onClick={goHome}>Volver Atras</button>
            </div>
            <div className='horario-data'>
                <div className="horario-info">
                    <h2> Informacion del Profesional </h2>
                    <InfoProfessional/>
                    <button className='common-btn' onClick={handleProfile}>Ver Perfil</button>
                    <ScheduleForm isProfessional={isProfessional} />
                </div>
                <div className="horario-calendar">
                    <h2> Días disponibles </h2>
                    <CalendarSelector/>
                </div>
                <div className="horario-dates">
                    <DateChips userId={loggedUser.id} isProfessional={isProfessional} />
                </div>
            </div>
        </div>
    )
}

export default HorarioComponent
