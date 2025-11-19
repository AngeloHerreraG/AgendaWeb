import type { Client } from "../../types/user";
import Navbar from "../navbar";
import "../../styles/profile.css";
import UserForm from "../forms/user-form";

import { useAuthStore } from "../store/authStore";

interface ClientProfileProps {
    client: Client;
    isMe: boolean;
}

const ClientProfile = ({ client, isMe }: ClientProfileProps) => {
    const {user: loggedUser} = useAuthStore();

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                <div className="client-info">
                    <div className="profile-header">
                        <h2>Perfil de {client.name}</h2>
                        {isMe && (
                            <div className="edit-profile-button">
                                <UserForm userData={client}/>
                            </div>
                        )}
                    </div>
                    <p><strong>Email:</strong> {client.email || 'No disponible'}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {client.birthDate || 'No disponible'}</p>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;