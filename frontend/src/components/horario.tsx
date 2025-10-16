import { useState } from 'react'
import type { User } from '../types/user'
import '../styles/horario.css'
import { Navigate, useParams } from 'react-router'
import { useAuth } from '../auth/auth'
import CalendarSelector from './horario/calendar';
import DateChips from './horario/date-chips';


const HorarioComponent = () => {
    const loggedUser: User | null = useAuth().user
    const { id } = useParams();
    const professionalId = Number(id)
    const isProfessional = loggedUser?.id === professionalId

    const [selectedDay, setSelectedDay] = useState<string>("")

    
    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }
    
    // Funcion para volver al home
    const goHome = () => {
        window.history.back();
    }

    return (
        <div className='horario-container'>
            <div className="horario-bg"></div>
            <div>
                <button onClick={goHome}>Volver Atras</button>
            </div>
            <div className='horario-data'>
                <div className="horario-info">
                    <h2> Informacion del Profesional </h2>
                </div>
                <div className="horario-calendar">
                    <h2> Días disponibles </h2>
                    <CalendarSelector 
                        professionalId={professionalId}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                    />
                </div>
                <div className="horario-dates">
                    <DateChips
                        userId={loggedUser.id}
                        professionalId={professionalId}
                        selectedDay={selectedDay}
                    />
                </div>
            </div>
        </div>
    )
}

export default HorarioComponent
