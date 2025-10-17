import { Link, useParams, Navigate } from 'react-router-dom';
import userServices from '../services/user';
import type { User } from '../types/user';
import '../styles/home.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth';

import Navbar from './navbar';

const Home = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState<User[]>([]);
    const loggedUser = useAuth().user;
    
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
                } catch {
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [id]);
    
    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    return (
        <div className="home-container">
            <Navbar userId={loggedUser.id} />
            <div className="home-header">
                <h2>Bienvenido {user.name} a la página principal, tu rol es {user.role}</h2>
                {user.role === "doctor" && <Link to={`/doctors/${user.id}/schedule`} className='home-update-link'>Editar mi horario</Link>}
            </div>
            <ul className='home-doctor-list'>
                {doctors.map((doctor) => (
                    <li key={doctor.id} className='home-doctor-item'>
                        {doctor.name}{" "}
                        <Link to={`/doctors/${doctor.id}/schedule`} className='home-link'>
                            Ver horario
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;