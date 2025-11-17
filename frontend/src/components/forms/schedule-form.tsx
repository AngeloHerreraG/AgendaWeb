import { useState } from 'react';
import type { profesionalSchedule } from '../../types/horario';
import type { Profesional } from '../../types/user';
import professionalServices from '../../services/professional';
import '../../styles/appointment.css'
import "../../styles/schedule-form.css"

interface Props {
    professionalData: Profesional;
    isProfessional: boolean;
    setReloadData: (value: boolean) => void;
}

// --- Constantes para el formulario ---
const ALL_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Mapeo entre los nombres completos de tu BBDD y los nombres cortos de la UI
const DAY_MAP_TO_SHORT: { [key: string]: string } = {
    "Lunes": "Lun", "Martes": "Mar", "Miércoles": "Mié",
    "Jueves": "Jue", "Viernes": "Vie", "Sábado": "Sáb", "Domingo": "Dom"
};
const DAY_MAP_TO_FULL: { [key: string]: string } = {
    "Lun": "Lunes", "Mar": "Martes", "Mié": "Miércoles",
    "Jue": "Jueves", "Vie": "Viernes", "Sáb": "Sábado", "Dom": "Domingo"
};
const HOUR_OPTIONS = Array.from({ length: 13 }, (_, i) => i+8); // [8, 9, 10, ..., 20]
const BLOCK_OPTIONS = [1, 2, 3, 4, 6]; // Correspondiente a bloques de 60, 30, 20, 15, 10 minutos

const ScheduleForm = (props: Props) => {
    const { professionalData, isProfessional, setReloadData } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Lógica para manejar el estado del modal
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');

    // los estados para el forms
    const daysShort = professionalData.disponibility?.days.map(day => DAY_MAP_TO_SHORT[day]) || [];
    const [selectedDays, setSelectedDays] = useState<string[]>(daysShort);
    const [startHour, setStartHour] = useState<number>(professionalData.disponibility?.startHour || 9);
    const [endHour, setEndHour] = useState<number>(professionalData.disponibility?.endHour || 17);
    const [blocksPerHour, setBlocksPerHour] = useState<number>(professionalData.disponibility?.blocksPerHour || 2);

    const updateNewSchedule = async (newDisponibility: profesionalSchedule) => {
        const response = await professionalServices.updateProfesionalSchedule(professionalData.id, newDisponibility);
        if (response.status === 200) {
            setConfirmationMessage('Horario actualizado correctamente.');
        } else { 
            setConfirmationMessage('Error al actualizar el horario. Inténtalo de nuevo.');
        }
        setModalOpen(false);
        setConfirmationMessage('Horario actualizado correctamente.');
        setIsLoading(false);
        setReloadData(true);
        setConfirmationModalOpen(true);
    };

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const closeConfirmationModal = () => {
        setConfirmationModalOpen(false);
    }

    const handleDayToggle = (day: string) => {
        setSelectedDays(prevDays =>
            prevDays.includes(day)
                ? prevDays.filter(d => d !== day) // Quitar día
                : [...prevDays, day] // Agregar día
        );
    };

    const handleSave = async () => {
        setIsLoading(true);

        const fullDays = selectedDays.map(day => DAY_MAP_TO_FULL[day]);
        // Construir el objeto de disponibilidad
        const updatedSchedule: profesionalSchedule = {
            days: fullDays,
            startHour,
            endHour,
            blocksPerHour
        };

        updateNewSchedule(updatedSchedule);
    };

    return (
        <div className='schedule-form-container'>
            {isProfessional && <button className='common-btn schedule-form-max-width-button' onClick={openModal}> Editar horario </button>}
            {modalOpen && (
                <>
                    <div className='appointment-bg'></div>
                    <div className='appointment-modal'>
                        {/* El formulario para editar el horario */}
                        <div>
                            <h3>Disponibilidad Horaria</h3>
                            <div className='schedule-form-button-group'>
                                <label>Días de Trabajo</label>
                                <div className='schedule-form-buttons'>
                                    {ALL_DAYS.map(day => (
                                        <button
                                            key={day}
                                            className={selectedDays.includes(day) ? 'schedule-form-selected-day' : ''}
                                            onClick={() => handleDayToggle(day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='schedule-form-time-settings'>
                                <div className='schedule-form-input-group'>
                                    <label htmlFor='start-time'>Hora Inicio</label>
                                    <select
                                        id='start-time'
                                        value={startHour}
                                        onChange={(e) => setStartHour(Number(e.target.value))}
                                    >
                                        {HOUR_OPTIONS.map(hour => (
                                            <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='schedule-form-input-group'>
                                    <label htmlFor='end-time'>Hora Fin</label>
                                    <select
                                        id='end-time'
                                        value={endHour}
                                        onChange={(e) => setEndHour(Number(e.target.value))}
                                    >
                                        {HOUR_OPTIONS.map(hour => (
                                            <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='schedule-form-input-group'>
                                    <label htmlFor='blocks'>Bloques/Hora</label>
                                    <select
                                        id='blocks'
                                        value={blocksPerHour}
                                        onChange={(e) => setBlocksPerHour(Number(e.target.value))}
                                    >
                                        {BLOCK_OPTIONS.map(block => (
                                            <option key={block} value={block}>{block}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='schedule-form-button-end-group'>
                                <button className='common-btn' onClick={closeModal}>Cancelar</button>
                                <button className='common-btn appointment-confirm-button' onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                        {/* --- Fin Contenido del Formulario --- */}
                    </div>
                </>
            )}
            {confirmationModalOpen && (
                <>
                    <div className='appointment-bg'></div>
                    <div className='appointment-modal'>
                        <h2>Resultado</h2>
                        <p>{confirmationMessage}</p>
                        <div className='schedule-form-button-end-group'>
                            <button className='common-btn' onClick={closeConfirmationModal}>Cerrar</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ScheduleForm;