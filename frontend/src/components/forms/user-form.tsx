import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import type { Client } from '../../types/user';
import dayjs from 'dayjs';
import '../../styles/appointment.css'
import '../../styles/form.css'
// import clientServices from '../../services/client';

import { useAuthStore } from "../store/authStore";


interface Props {
    userData: Client;
}

const UserForm = ( {userData}: Props) => {
    const { updateUserData } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Lógica para manejar el estado del modal
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');

    const [name, setName] = useState<string>(userData.name);
    const [email, setEmail] = useState<string>(userData.email || '');
    const formattedBirthDate = userData.birthDate ? dayjs(userData.birthDate.split("T")[0]).format('YYYY-MM-DD') : '';
    const [birthDate, setBirthDate] = useState<string>(formattedBirthDate);

    const updateNewSchedule = async (updatedUserData: Partial<Client>) => {
        // const response = await clientServices.updateClientInfo(userData.id, updatedUserData);
        // if (response.status === 200) {
        //     setConfirmationMessage('Horario actualizado correctamente.');
        // } else { 
        //     setConfirmationMessage('Error al actualizar el horario. Inténtalo de nuevo.');
        // }
        try {
            await updateUserData(updatedUserData);
            setConfirmationMessage('Información actualizada correctamente.');
        } catch (error) {
            console.error("Error updating user data:", error);
            setConfirmationMessage('Error al actualizar la información. Inténtalo de nuevo.');
        }
        setModalOpen(false);
        setIsLoading(false);
        setConfirmationModalOpen(true);
    };

    const openModal = () => {
        setModalOpen(true);
        setName(userData.name);
        setEmail(userData.email || '');
        setBirthDate(formattedBirthDate);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const closeConfirmationModal = () => {
        setConfirmationModalOpen(false);
    }

    const handleSave = async () => {
        setIsLoading(true);
        const updatedUserData: Partial<Client> = {
            name,
            email,
            birthDate,
            role: 'client'
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
                    <div className='appointment-modal'>
                        {/* El formulario para editar el usuario */}
                        <div>
                            <h3 style={{textAlign: "center"}}>Actualizar informacion</h3>
                            <h4>Datos personales</h4>
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
}

export default UserForm;