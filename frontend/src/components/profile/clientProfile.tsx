import { Navigate } from 'react-router'
import type { Client } from "../../types/user";
import Navbar from "../navbar";
import "../../styles/profile.css";
import UserForm from "../forms/user-form";

import { useAuthStore } from "../store/authStore";


interface ClientProfileProps {
    client: Client;
    setReloadData: (value: boolean) => void;
}

const ClientProfile = ({ client, setReloadData }: ClientProfileProps) => {
        const {user: loggedUser, authStatus} = useAuthStore();


    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                <div className="client-info">
                    <div className="profile-header">
                        <h2>Perfil de {client.name}</h2>
                        {loggedUser?.id === client.id && (
                            <div className="edit-profile-button">
                                <UserForm userData={client} setReloadData={setReloadData} />
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