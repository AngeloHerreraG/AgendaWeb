import { useParams } from "react-router-dom";
import userServices from "../services/user";
import type { User, Doctor } from "../types/user";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import "../styles/profile.css";
import { useAuth } from "../auth/auth";


const ProfileComponent = () => {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const loggedUser: User | null = useAuth().user;
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!isNaN(userId)) {
                const data = await userServices.getUserById(userId);
                setUserProfile(data);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleEditProfile = () => {
        // Se puede implementar la lógica para editar el perfil
        console.log("Editar perfil");
    }

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                {loading ? (
                    <p>Cargando...</p>
                ) : userProfile ? (
                    <div>
                        {userProfile.role === 'doctor' && (
                            <>
                                <div className="profile-picture-info-container">
                                    <div className="profile-picture">
                                        <AccountCircleIcon style={{ fontSize: 200 }} />
                                    </div>
                                    <div className="profile-info">
                                        <div className="profile-header">
                                            <h2>Perfil de {userProfile.name}</h2>
                                            {loggedUser?.id === userProfile.id && (
                                                <div className="edit-profile-button">
                                                    <IconButton onClick={handleEditProfile}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </div>
                                            <div className="doctor-info">
                                                <p><strong>Especialidad:</strong> {(userProfile as Doctor).speciality || 'No especificada'}</p>
                                                <p><strong>Descripción:</strong> {(userProfile as Doctor).description || 'No disponible'}</p>
                                            </div>
                                    </div>
                                </div>
                                <div className="doctor-details">
                                    <p><strong>Intereses:</strong> {(userProfile as Doctor).interests?.join(', ') || 'Ninguno'}</p>
                                </div>
                            </>
                        )}
                        {userProfile.role === 'patient' && (
                            <div className="patient-info">
                                <div className="profile-header">
                                    <h2>Perfil de {userProfile.name}</h2>
                                    {loggedUser?.id === userProfile.id && (
                                        <div className="edit-profile-button">
                                            <IconButton onClick={handleEditProfile}>
                                                <EditIcon />
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                                <p><strong>Email:</strong> {userProfile.email || 'No disponible'}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {userProfile.birthDate || 'No disponible'}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Usuario no encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileComponent;
