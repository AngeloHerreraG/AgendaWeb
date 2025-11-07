import type { selectedBlock } from '../../types/horario'
import '../../styles/appointment.css'
import { useEffect } from 'react';
import type { Profesional } from '../../types/user';

interface Props {
    professionalData: Profesional;
    isProfessional: boolean;
    setOpen: (value: boolean) => void;
    selectedScheduleBlock: selectedBlock | null;
    selectedDay?: string | null;
}

const Appointment = (props: Props) => {
    const { professionalData, isProfessional, setOpen, selectedScheduleBlock, selectedDay } = props;

    useEffect(() => {
        // Evitar el scroll del fondo al abrir el modal
        document.body.style.overflow = 'hidden';
    }, []);

    const updateStatus = (newStatus: 'pending' | 'confirmed' | 'cancelled' | 'blocked') => {
        // Lógica para actualizar el estado de la cita
        console.log("Actualizar estado a: ", newStatus);
    }

    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    }

    const handleConfirm = () => {
        document.body.style.overflow = 'auto';
        updateStatus('confirmed');
        setOpen(false);
    }

    const handleCancel = () => {
        document.body.style.overflow = 'auto';
        updateStatus('cancelled');
        setOpen(false);
    }

    const handleBlock = () => {
        document.body.style.overflow = 'auto';
        updateStatus('blocked');
        setOpen(false);
    }

    return (
        <>
            <div className='appointment-bg'></div>
            <div className='appointment-modal'>
                <h2>Detalles de la cita</h2>
                {selectedScheduleBlock && (
                    <div>
                        <p> {selectedDay} </p>
                        <p> {selectedScheduleBlock.label} </p>
                        <h3> {professionalData.name} </h3>
                        <p> {professionalData.email} </p>
                    </div>
                )}
                <div className='appointment-buttons'>
                    <button className='common-btn' onClick={handleClose}>Cerrar</button>
                    {isProfessional && <button className='common-btn appointment-reschedule-button' onClick={handleBlock}>Bloquear</button>}
                    {isProfessional && <button className='common-btn appointment-cancel-button' onClick={handleCancel}>Rechazar</button>}
                    <button className='common-btn appointment-confirm-button' onClick={handleConfirm}>{isProfessional ? 'Confirmar Cita' : 'Reservar Cita'}</button>
                </div>
            </div>
        </>
    )
}

export default Appointment;