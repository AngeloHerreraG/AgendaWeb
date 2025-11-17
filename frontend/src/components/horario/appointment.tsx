import type { selectedBlock, BlockStatus } from '../../types/horario'
import '../../styles/appointment.css'
import { useState, useEffect } from 'react';
import type { Professional } from '../../types/user';
import scheduleService from '../../services/schedule';

interface Props {
    professionalData: Professional;
    isProfessional: boolean;
    setOpen: (value: boolean) => void;
    setReloadChips: (value: boolean) => void;
    selectedScheduleBlock: selectedBlock | null;
    selectedDay?: string | null;
}

const Appointment = (props: Props) => {
    const { professionalData, isProfessional, setOpen, setReloadChips, selectedScheduleBlock, selectedDay } = props;

    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');

    useEffect(() => {
        // Evitar el scroll del fondo al abrir el modal
        document.body.style.overflow = 'hidden';
        setModalOpen(true);
    }, []);

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
        let response;
        // Revisar si el bloque ya fue creado o no
        const created = await scheduleService.getSchedule(selectedScheduleBlock.id);
        if (!created) {
            response = await scheduleService.createScheduleBlock(selectedScheduleBlock, newStatus);
        }
        else {
            response = await scheduleService.updateScheduleBlock(selectedScheduleBlock, newStatus);
        }
        if (response.status === 201) {
            setConfirmationMessage('Bloque creado correctamente.');
            setReloadChips(true);
        } 
        else if (response.status === 200) {
            setConfirmationMessage('Bloque actualizado correctamente.');
            setReloadChips(true);
        }
        else {
            setConfirmationMessage('Error al crear/actualizar el bloque.');
        }
        setConfirmationModalOpen(true);
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
            scheduleService.deleteScheduleBlock(selectedScheduleBlock.id);
            setConfirmationMessage('Bloque eliminado correctamente.');
            setConfirmationModalOpen(true);
            setReloadChips(true);
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
                                <p> {selectedDay} </p>
                                <p> {`${selectedScheduleBlock.startHour} - ${selectedScheduleBlock.endHour}`} </p>
                                <h3> {professionalData.name} </h3>
                                <p> {professionalData.email} </p>
                                {selectedScheduleBlock.state && <p><strong>Estado:</strong> {selectedScheduleBlock.state}</p>}
                            </div>
                        )}
                        <div className='appointment-buttons'>
                            <button className='common-btn' onClick={handleClose}>Cerrar</button>
                            {isProfessional && <button className='common-btn appointment-reschedule-button' onClick={handleBlock}>Bloquear</button>}
                            {isProfessional && <button className='common-btn appointment-cancel-button' onClick={handleCancel}>Rechazar</button>}
                            <button className='common-btn appointment-confirm-button' onClick={handleConfirm}>{isProfessional ? 'Confirmar Cita' : 'Reservar Cita'}</button>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <button className='common-btn appointment-cancel-button' onClick={handleDelete}>Eliminar</button>
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