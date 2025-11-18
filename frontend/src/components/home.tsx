import { Link, Navigate } from 'react-router-dom';
import professionalServices from '../services/professional';
import type { User } from '../types/user';
import '../styles/home.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore'

import Navbar from './navbar';

const Home = () => {
    const [professionals, setProfessionals] = useState<User[]>([]);
    const {user: loggedUser, authStatus} = useAuthStore();
    
    useEffect(() => {
        const fetchProfessionals = async () => {
            const fetchedProfessionals = await professionalServices.getAllProfessionals();
            setProfessionals(fetchedProfessionals);
        };
        fetchProfessionals();
    }, []);
    
    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="home-container">
            <Navbar userId={loggedUser.id} />
            <div className="home-header">
                <h2>Bienvenido {loggedUser.name}</h2>
                {loggedUser.role === "professional" && <Link to={`/professional/${loggedUser.id}`} className='home-update-link'>Editar mi horario</Link>}
            </div>
            <ul className='home-professional-list'>
                {professionals.map((professional) => (
                    <li key={professional.id} className='home-professional-item'>
                        {professional.name}{" "}
                        <Link to={`/professional/${professional.id}`} className='home-link'>
                            Ver horario
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;