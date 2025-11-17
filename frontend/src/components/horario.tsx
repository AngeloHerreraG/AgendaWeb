import { useEffect, useState } from 'react'
import type { Professional } from '../types/user'
import { useNavigate, useParams, Navigate } from 'react-router'
import { useAuth } from '../auth/auth'
import userServices from '../services/user'
import '../styles/horario.css'

import Navbar from './navbar'
import InfoProfessional from './horario/information'
import CalendarSelector from './horario/calendar';
import DateChips from './horario/date-chips';

import ScheduleForm from './forms/schedule-form';

const HorarioComponent = () => {
    const navigate = useNavigate();
    const {user: loggedUser, loading: authLoading} = useAuth();
    const professionalId = useParams().id;
    const isProfessional = loggedUser?.id === professionalId;
    
    const [loading, setLoading] = useState<boolean>(true);
    const [reloadData, setReloadData] = useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null)  // Para mostrar el modal de información de la cita
    const [professionalData, setProfessionalData] = useState<Professional | null>(null);

    useEffect(() => {
        const fetchProfessionalData = async () => {
            if (professionalId) {
                setLoading(true);
                const data = await userServices.getUserById(professionalId);
                if (data.role === 'professional') {
                    setProfessionalData(data);
                    setLoading(false);
                }
            }
            if (reloadData) setReloadData(false);
        };
        
        fetchProfessionalData();
    }, [professionalId, reloadData]);

    // Revisamos si el auth esta cargando aun
    if (authLoading) {
        return <div>Cargando...</div>;
    }

    // Si no esta loggeado, redirigir al login
    if (!loggedUser) {
        return <Navigate to='/login' replace />;
    }

    if (!professionalData || loading) {
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
                    <InfoProfessional professionalData={professionalData} />
                    <button className='common-btn' onClick={handleProfile}>Ver Perfil</button>
                    <ScheduleForm professionalData={professionalData} isProfessional={isProfessional} setReloadData={setReloadData} />
                </div>
                <div className="horario-calendar">
                    <h2> Días disponibles </h2>
                    <CalendarSelector professionalData={professionalData} selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
                </div>
                <div className="horario-dates">
                    <DateChips userId={loggedUser.id} professionalData={professionalData} isProfessional={isProfessional} selectedDay={selectedDay}/>
                </div>
            </div>
        </div>
    )
}

export default HorarioComponent
