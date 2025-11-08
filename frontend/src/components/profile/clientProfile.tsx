import type { Client, User } from "../../types/user";
import Navbar from "../navbar";
import { useAuth } from "../../auth/auth";
import "../../styles/profile.css";
import UserForm from "../forms/user-form";

interface ClientProfileProps {
    user: Client;
    setReloadData: (value: boolean) => void;
}

const ClientProfile = ({ user, setReloadData }: ClientProfileProps) => {
    const loggedUser: User | null = useAuth().user

    return (
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                <div className="client-info">
                    <div className="profile-header">
                        <h2>Perfil de {user.name}</h2>
                        {loggedUser?.id === user.id && (
                            <div className="edit-profile-button">
                                <UserForm userData={user} setReloadData={setReloadData} />
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