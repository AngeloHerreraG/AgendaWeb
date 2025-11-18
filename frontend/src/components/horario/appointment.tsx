import type { selectedBlock, BlockStatus } from '../../types/horario'
import '../../styles/appointment.css'
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { useAuthStore } from '../store/authStore';
import { useScheduleStore } from '../store/scheduleStore'

interface Props {
    isProfessional: boolean;
    setOpen: (value: boolean) => void;
    selectedScheduleBlock: selectedBlock | null;
}

const Appointment = (props: Props) => {
    const { isProfessional, setOpen, selectedScheduleBlock } = props;
    const { professionalData, selectedDay, updateScheduleStatus, deleteScheduleBlock } = useScheduleStore();
    const { user: loggedUser } = useAuthStore()

    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');

    useEffect(() => {
        // Evitar el scroll del fondo al abrir el modal
        document.body.style.overflow = 'hidden';
        setModalOpen(true);
    }, []);

    if (!selectedScheduleBlock || !professionalData || !selectedDay) {
        return null;
    }

    const closeConfirmationModal = () => {
        document.body.style.overflow = 'auto';
        setConfirmationModalOpen(false);
        setOpen(false);
    }

    const updateStatus = async (newStatus: BlockStatus) => {
        setModalOpen(false);
        // Lógica para actualizar el estado de la cita
        if (!selectedScheduleBlock) {
            return;
        }
        try {
            const response = await updateScheduleStatus(selectedScheduleBlock, newStatus);
            if (response.status === 201) {
                setConfirmationMessage(response.message);
                setConfirmationModalOpen(true);
            } 
            else if (response.status === 200) {
                setConfirmationMessage(response.message);
                setConfirmationModalOpen(true);
            }
        } catch (error) {
            console.error("Error updating schedule status:", error);
            setConfirmationMessage('Error al actualizar el estado del bloque.');
            setConfirmationModalOpen(true);
            return;
        }
    }

    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    }

    const handleConfirm = () => {
        if (isProfessional) {
            updateStatus('confirmed');
        }
        else {
            updateStatus('pending');
        }
    }

    const handleCancel = () => {
        updateStatus('cancelled');
    }

    const handleBlock = () => {
        updateStatus('blocked');
    }
    
    const handleDelete = () => {
        if (!selectedScheduleBlock) {
            return;
        }
        try {
            deleteScheduleBlock(selectedScheduleBlock);
            setConfirmationMessage('Bloque eliminado correctamente.');
            setConfirmationModalOpen(true);
        }
        catch (error) {
            setConfirmationMessage('Error al eliminar el bloque.');
            console.error(error);
            setConfirmationModalOpen(true);
        }
    }

    return (
        <>
            {modalOpen && (
                <>
                    <div className='appointment-bg'></div>
                    <div className='appointment-modal'>
                        <h2>Detalles de la cita</h2>
                        {selectedScheduleBlock && (
                            <div>
                                <p> {dayjs(selectedDay).format('dddd D [de] MMMM [de] YYYY')} </p>
                                <p> {`${selectedScheduleBlock.startHour} - ${selectedScheduleBlock.endHour}`} </p>
                                <h3> {professionalData.name} </h3>
                                <p> {professionalData.email} </p>
                                {selectedScheduleBlock.state && <p><strong>Estado:</strong> {selectedScheduleBlock.state}</p>}
                            </div>
                        )}
                        <div className='appointment-buttons'>
                            <button className='common-btn' onClick={handleClose}>Cerrar</button>
                            {isProfessional && !selectedScheduleBlock?.state && <button className='common-btn appointment-reschedule-button' onClick={handleBlock}>Bloquear</button>}
                            {isProfessional && (selectedScheduleBlock?.state === 'pending') && <button className='common-btn appointment-cancel-button' onClick={handleCancel}>Rechazar</button>}
                            {isProfessional && (selectedScheduleBlock?.state === 'pending') && <button className='common-btn appointment-confirm-button' onClick={handleConfirm}>Confirmar Cita</button>}
                            {!isProfessional && (!selectedScheduleBlock?.state) && <button className='common-btn appointment-confirm-button' onClick={handleConfirm}>Solicitar Cita</button>}
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            {(
                                (isProfessional && (selectedScheduleBlock?.state === 'blocked' || selectedScheduleBlock?.state === 'cancelled')) ||
                                (!isProfessional && selectedScheduleBlock?.userId === loggedUser?.id && selectedScheduleBlock?.state === 'pending')
                            ) && <button className='common-btn appointment-cancel-button' onClick={handleDelete}>Eliminar</button>}
                        </div>

                    </div>
                </>
            )}
            {confirmationModalOpen && (
                <>
                    <div className='appointment-bg'></div>
                    <div className='appointment-modal'>
                        <h2>Resultado</h2>
                        <p>{confirmationMessage}</p>
                        <div className='form-button'>
                            <button className='common-btn' onClick={closeConfirmationModal}>Cerrar</button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Appointment;