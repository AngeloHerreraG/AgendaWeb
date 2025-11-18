import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import type { Professional } from '../../types/user';
import dayjs from 'dayjs';
import '../../styles/appointment.css'
import '../../styles/form.css'

import { useAuthStore } from '../store/authStore';

interface Props {
    professionalData: Professional;
}

const ProfessionalForm = ({professionalData}: Props) => {
    const { updateProfessionalData } = useAuthStore();
    
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Lógica para manejar el estado del modal
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');

    const [name, setName] = useState<string>(professionalData.name);
    const [email, setEmail] = useState<string>(professionalData.email || '');
    const formattedBirthDate = professionalData.birthDate ? dayjs(professionalData.birthDate.split("T")[0]).format('YYYY-MM-DD') : '';
    const [birthDate, setBirthDate] = useState<string>(formattedBirthDate);

    const [speciality, setSpeciality] = useState<string>(professionalData.speciality || '');
    const [description, setDescription] = useState<string>(professionalData.description || '');
    const [interests, setInterests] = useState<string>(professionalData.interests ? professionalData.interests.join(', ') : '');

    const updateNewSchedule = async (updatedUserData: Partial<Professional>) => {
        try {
            await updateProfessionalData(updatedUserData);
            setConfirmationMessage('Información actualizada correctamente.');
        } catch (error) {
            console.error("Error updating professional data:", error);
            setConfirmationMessage('Error al actualizar la información. Inténtalo de nuevo.');
        }
        setModalOpen(false);
        setIsLoading(false);
        setConfirmationModalOpen(true);
    };

    const openModal = () => {
        setModalOpen(true);
        setName(professionalData.name);
        setEmail(professionalData.email);
        setBirthDate(formattedBirthDate);
        setSpeciality(professionalData.speciality);
        setDescription(professionalData.description);
        setInterests(professionalData.interests ? professionalData.interests.join(', ') : '');
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const closeConfirmationModal = () => {
        setConfirmationModalOpen(false);
    }

    const handleSave = async () => {
        setIsLoading(true);
        const updatedUserData: Partial<Professional> = {
            name,
            email,
            birthDate,
            speciality,
            description,
            interests: interests.split(',').map(interest => interest.trim()),
            role: 'professional'
        };
        updateNewSchedule(updatedUserData);
    };


    return (
        <>
            <IconButton onClick={openModal}>
                <EditIcon />
            </IconButton>
            {modalOpen && (
                <>
                    <div className='appointment-bg'></div>
                    <div className='appointment-modal form-container'>
                        {/* El formulario para editar el usuario */}
                        <div>
                            <h3 style={{textAlign: "center"}}>Actualizar informacion</h3>
                            <h4>Datos Personales</h4>
                            <div className='form-inputs-group'>
                                <div className='form-input'>
                                    <label htmlFor='name'>Nombre</label>
                                    <input
                                        id='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor='email'>Correo</label>
                                    <input
                                        id='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor='blocks'>Fecha nacimiento</label>
                                    <input
                                        id='birthDate'
                                        type='date'
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <h4>Informacion Profesional</h4>
                            <div className='form-inputs-group'>
                                <div className='form-input'>
                                    <label htmlFor='speciality'>Especialidad</label>
                                    <input
                                        id='speciality'
                                        value={speciality}
                                        onChange={(e) => setSpeciality(e.target.value)}
                                    />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor='description'>Descripcion</label>
                                    <input
                                        id='description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor='interests'>Intereses</label>
                                    <input
                                        id='interests'
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='form-button'>
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
                        <div className='form-button'>
                            <button className='common-btn' onClick={closeConfirmationModal}>Cerrar</button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProfessionalForm;