import type { Profesional, User } from "../../types/user";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../../auth/auth";
import "../../styles/profile.css";
import Navbar from "../navbar";

interface ProfesionalProfileProps {
    user: Profesional;
}

const ProfesionalProfile = ({ user }: ProfesionalProfileProps) => {
    const loggedUser: User | null = useAuth().user;

    const handleEditProfile = () => {
        // Se puede implementar la lógica para editar el perfil
        console.log("Editar perfil");
    }

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                <>
                    <div className="profile-picture-info-container">
                        <div className="profile-picture">
                            <AccountCircleIcon style={{ fontSize: 200 }} />
                        </div>
                        <div className="profile-info">
                            <div className="profile-header">
                                <h2>Perfil de {user.name}</h2>
                                {loggedUser?.id === user.id && (
                                    <div className="edit-profile-button">
                                        <IconButton onClick={handleEditProfile}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                )}
                            </div>
                                <div className="profesional-info">
                                    <p><strong>Especialidad:</strong> {user.speciality || 'No especificada'}</p>
                                    <p><strong>Descripción:</strong> {user.description || 'No disponible'}</p>
                                </div>
                        </div>
                    </div>
                    <div className="profesional-details">
                        <p><strong>Intereses:</strong> {user.interests?.join(', ') || 'Ninguno'}</p>
                    </div>
                </>
            </div>
        </div>
    );
};

export default ProfesionalProfile;