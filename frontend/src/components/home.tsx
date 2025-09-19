import { Link, useParams, Navigate } from 'react-router-dom';
import userServices from '../services/user';
import type { User } from '../types/user';

import { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth';

const Home = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState<User[]>([]);
    const logedUser = useAuth().user;

    if (!logedUser) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        const fetchDoctors = async () => {
            const fetchedDoctors = await userServices.getAllDoctors();
            setDoctors(fetchedDoctors);
        };
        fetchDoctors();
    }, []);

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
            <div>
            <h2>Bienvenido {user.name} a la página principal, tu rol es {user.role}</h2>
            {user.role === "doctor" && <Link to={`/doctors/${user.id}/schedule`}>Editar mi horario</Link>}
            </div>
            <ul>
                {doctors.map((doctor) => (
                    <li key={doctor.id}>
                        {doctor.name}{" "}
                        <Link to={`/doctors/${doctor.id}/schedule`}>
                            Ver horario
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;