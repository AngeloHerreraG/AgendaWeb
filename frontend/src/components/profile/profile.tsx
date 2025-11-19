import type { User } from "../../types/user";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import ClientProfile from "./clientProfile";
import ProfessionalProfile from "./professionalProfile";
import { useEffect, useState } from "react";
import userServices from "../../services/user";

import { useAuthStore } from "../store/authStore";

const ProfileComponent = () => {
    const { id: userId } = useParams();
    const {user: loggedUser, authStatus} = useAuthStore();
    const navigate = useNavigate();

    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const isMe = loggedUser ? userId === loggedUser.id : false;

    // Este useEffect solo se llama si estamos viendo el perfil de alguien mas, si es el nuestro
    // no hace falta por que ya tenemos los datos en el authStore
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (isMe || !userId) return;
            setLoading(true);
            try {
                const fetchedUser = await userServices.getUserById(userId);
                setOtherUser(fetchedUser);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setOtherUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, isMe]);

    
    if (authStatus === "loading" || loading) {
        return <div>Cargando...</div>;
    }

    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    // Funcion para volver al home
    const goHome = () => {
        return navigate(`/home/${loggedUser?.id}`);
    }

    // Finalmente decidimos que mostrar dependiendo si es nuestro perfil o el de otro usuario
    // Si es el del otro usuario no nos preocupamos por el reload data por que solo el usuario
    // propio puede hacerlo
    const userToShow = isMe ? loggedUser : otherUser;

    const DisplayProfile = () => {
        switch (userToShow?.role) {
            case 'client':
                return <ClientProfile client={userToShow} isMe={isMe} />;
            case 'professional':
                return <ProfessionalProfile professional={userToShow} isMe={isMe} />;
            default:
                return <div>Rol de usuario desconocido.</div>;
        }
    }

    return (
        <div>
            <DisplayProfile />
            <div style={{boxSizing: 'border-box', display: "flex", justifyContent: "end", margin: '20px'}}>
                <button className='common-btn' onClick={goHome}>Volver al inicio</button>
            </div>
        </div>
    )

}

export default ProfileComponent;