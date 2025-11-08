import type { User } from "../../types/user";
import { useParams } from "react-router-dom";
import ClientProfile from "./clientProfile";
import ProfesionalProfile from "./professionalProfile";
import { useEffect, useState } from "react";
import userServices from "../../services/user";

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

    switch (user?.role) {
        case 'client':
            return <ClientProfile user={user} setReloadData={setReloadData} />;
        case 'profesional':
            return <ProfesionalProfile professional={user} setReloadData={setReloadData} />;
    }
}

export default ProfileComponent;