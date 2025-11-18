import type { User } from "../../types/user";
import { useParams, Navigate } from "react-router-dom";
import ClientProfile from "./clientProfile";
import ProfessionalProfile from "./professionalProfile";
import { useEffect, useState } from "react";
import userServices from "../../services/user";

import { useAuthStore } from "../store/authStore";

const ProfileComponent = () => {
    const { id: userId } = useParams();
    const {user: loggedUser, authStatus} = useAuthStore();

    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const myProfile = loggedUser && userId === loggedUser.id;

    // Este useEffect solo se llama si estamos viendo el perfil de alguien mas, si es el nuestro
    // no hace falta por que ya tenemos los datos en el authStore
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (myProfile || !userId) return;
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
    }, [userId, myProfile]);

    
    if (authStatus === "loading" || loading) {
        return <div>Cargando...</div>;
    }

    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    // Finalmente decidimos que mostrar dependiendo si es nuestro perfil o el de otro usuario
    const userToShow = myProfile ? loggedUser : otherUser;

    switch (userToShow?.role) {
        case 'client':
            return <ClientProfile client={userToShow} />;
        case 'professional':
            return <ProfessionalProfile professional={userToShow} />;
        default:
            return <div>Rol de usuario desconocido.</div>;
    }
}

export default ProfileComponent;