import type { User } from "../../types/user";
import { useParams } from "react-router-dom";
import ClientProfile from "./clientProfile";
import ProfesionalProfile from "./profesionalProfile";
import { useEffect, useState } from "react";
import userServices from "../../services/user";

const ProfileComponent = () => {
    const { id } = useParams();
    const userId = id;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            const data = await userServices.getUserById(userId);
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

export default ProfileComponent;