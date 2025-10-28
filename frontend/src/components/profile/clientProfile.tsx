import type { Client, User } from "../../types/user";
import Navbar from "../navbar";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "../../auth/auth";
import "../../styles/profile.css";

interface ClientProfileProps {
    user: Client;
}

const ClientProfile = ({ user }: ClientProfileProps) => {
    const loggedUser: User | null = useAuth().user

    const handleEditProfile = () => {
        // Se puede implementar la lógica para editar el perfil
        console.log("Editar perfil");
    }

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                <div className="client-info">
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
                    <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {user.birthDate || 'No disponible'}</p>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;