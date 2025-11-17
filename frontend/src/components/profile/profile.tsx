import type { User } from "../../types/user";
import { useParams, Navigate } from "react-router-dom";
import ClientProfile from "./clientProfile";
import ProfessionalProfile from "./professionalProfile";
import { useEffect, useState } from "react";
import userServices from "../../services/user";
import { useAuth } from '../../auth/auth'


const ProfileComponent = () => {
    const { id } = useParams();
    const userId = id;
    const [user, setUser] = useState<User | null>(null);
    const [reloadData, setReloadData] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            const data = await userServices.getUserById(userId);
            setUser(data);
            if (reloadData) setReloadData(false);
        };

        fetchUserProfile();
    }, [userId, reloadData]);

    const {user: loggedUser, loading: authLoading} = useAuth();
    
    if (authLoading) {
        return <div>Cargando...</div>;
    }

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    switch (user?.role) {
        case 'client':
            return <ClientProfile client={user} setReloadData={setReloadData} />;
        case 'professional':
            return <ProfessionalProfile professional={user} setReloadData={setReloadData} />;
    }
}

export default ProfileComponent;