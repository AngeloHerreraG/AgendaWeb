import type { Profesional, User } from "../../types/user";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../../auth/auth";
import "../../styles/profile.css";
import Navbar from "../navbar";
import ProfessionalForm from "../forms/professional-form";

interface ProfessionalProfileProps {
    professional: Profesional;
    setReloadData: (value: boolean) => void;
}

const ProfessionalProfile = ({ professional, setReloadData }: ProfessionalProfileProps) => {
    const loggedUser: User | null = useAuth().user;

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
                                <div className="profesional-info">
                                    <p><strong>Especialidad:</strong> {professional.speciality || 'No especificada'}</p>
                                    <p><strong>Descripción:</strong> {professional.description || 'No disponible'}</p>
                                </div>
                        </div>
                    </div>
                    <div className="profesional-details">
                        <p><strong>Intereses:</strong> {professional.interests?.join(', ') || 'Ninguno'}</p>
                    </div>
                </>
            </div>
        </div>
    );
};

export default ProfessionalProfile;