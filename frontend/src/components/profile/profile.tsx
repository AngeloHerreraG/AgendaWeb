import { useParams } from "react-router-dom";
import clientService from "../../services/client";
import profesionalService from "../../services/profesional"
import type { User } from "../../types/user";
import ClientProfile from "./clientProfile";
import ProfesionalProfile from "./profesionalProfile";
import { useEffect, useState } from "react";

const ProfileComponent = () => {
    const { id } = useParams();
    const userId = id;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            const data = await clientService.getClientById(userId) || await profesionalService.getProfesionalById(userId);
            setUser(data);
        };

        fetchUserProfile();
    }, [userId]);

    switch (user?.role) {
        case 'client':
            return <ClientProfile user={user} />;
        case 'profesional':
            return <ProfesionalProfile user={user} />;
    }
}
/*
    return (
        <div>
            
        </div>
        <div className="profile-container">
            <Navbar userId={loggedUser?.id} />
            <div className="profile-content">
                {loading ? (
                    <p>Cargando...</p>
                ) : userProfile ? (
                    <div>
                        {userProfile?.role === 'profesional' && (
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
                                            <div className="profesional-info">
                                                <p><strong>Especialidad:</strong> {(userProfile as Profesional).speciality || 'No especificada'}</p>
                                                <p><strong>Descripción:</strong> {(userProfile as Profesional).description || 'No disponible'}</p>
                                            </div>
                                    </div>
                                </div>
                                <div className="profesional-details">
                                    <p><strong>Intereses:</strong> {(userProfile as Profesional).interests?.join(', ') || 'Ninguno'}</p>
                                </div>
                            </>
                        )}
                        {userProfile?.role === 'client' && (
                            <div className="client-info">
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
*/

export default ProfileComponent;

