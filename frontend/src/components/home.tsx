import { useParams } from 'react-router-dom';
import userServices from '../services/user';
import type { User } from '../types/user';

import { useEffect, useState } from 'react';

const Home = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    const fetchedUser = await userServices.getUserById(Number(id));
                    setUser(fetchedUser);
                } catch (error) {
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    return (
        <div>
            <h2>Bienvenido {user.name} a la página principal, tu rol es {user.role}</h2>
        </div>
    );
};

export default Home;