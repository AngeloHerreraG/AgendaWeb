import { useState } from 'react'
import type { User } from '../types/user'
import '../styles/horario.css'
import { useNavigate, useParams, Navigate } from 'react-router'
import { useAuth } from '../auth/auth'

import Navbar from './navbar'
import InfoProfesional from './horario/information'
import CalendarSelector from './horario/calendar';
import DateChips from './horario/date-chips';


const HorarioComponent = () => {
    const navigate = useNavigate();
    const loggedUser: User | null = useAuth().user
    const professionalId = useParams().id;

    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    // const [showDateInfoModal, setShowDateInfoModal] = useState<boolean>(false)  // Para mostrar el modal de información de la cita
    
    // Si no esta loggeado, redirigir al login
    if (!loggedUser) {
        return <Navigate to='/login' replace />;
    }

    // Funcion para volver al home
    const goHome = () => {
        return navigate(`/home/${loggedUser?.id}`, { replace: true });
    }

    const handleProfile = () => {
        return navigate(`/profile/${professionalId}`, { replace: true });
    }

    return (
        <div className='horario-container'>
            <Navbar userId={loggedUser.id} />
            <div className="horario-bg"></div>
            <div>
                <button onClick={goHome}>Volver Atras</button>
            </div>
            <div className='horario-data'>
                <div className="horario-info">
                    <h2> Informacion del Profesional </h2>

                    {professionalId && <InfoProfesional professionalId={professionalId} />}
                    <button onClick={handleProfile}>Ver Perfil</button>
                </div>
                <div className="horario-calendar">
                    <h2> Días disponibles </h2>
                    {professionalId && <CalendarSelector
                        professionalId={professionalId}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                    />}
                </div>
                <div className="horario-dates">
                    { professionalId && <DateChips
                        userId={loggedUser.id}
                        professionalId={professionalId}
                        selectedDay={selectedDay}
                    />}
                </div>
            </div>
        </div>
    )
}

export default HorarioComponent
