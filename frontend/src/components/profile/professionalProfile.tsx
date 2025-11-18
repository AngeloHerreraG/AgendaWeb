import { Navigate } from 'react-router'
import type { Professional } from "../../types/user";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "../../styles/profile.css";
import Navbar from "../navbar";
import ProfessionalForm from "../forms/professional-form";

import { useAuthStore } from '../store/authStore';

interface ProfessionalProfileProps {
    professional: Professional;
    setReloadData: (value: boolean) => void;
}

const ProfessionalProfile = ({ professional, setReloadData }: ProfessionalProfileProps) => {
        const {user: loggedUser, authStatus} = useAuthStore();
    

    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
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
                                <h2>Perfil de {professional.name}</h2>
                                {loggedUser?.id === professional.id && (
                                    <div className="edit-profile-button">
                                        <ProfessionalForm professionalData={professional} setReloadData={setReloadData}/>
                                    </div>
                                )}
                            </div>
                                <div className="professional-info">
                                    <p><strong>Especialidad:</strong> {professional.speciality || 'No especificada'}</p>
                                    <p><strong>Descripción:</strong> {professional.description || 'No disponible'}</p>
                                </div>
                        </div>
                    </div>
                    <div className="professional-details">
                        <p><strong>Intereses:</strong> {professional.interests?.join(', ') || 'Ninguno'}</p>
                    </div>
                </>
            </div>
        </div>
    );
};

export default ProfessionalProfile;