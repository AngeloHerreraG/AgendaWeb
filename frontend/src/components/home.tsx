import { Link, Navigate } from 'react-router-dom';
import profesionalServices from '../services/professional';
import type { User } from '../types/user';
import '../styles/home.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth';

import Navbar from './navbar';

const Home = () => {
    const [profesionals, setProfesionals] = useState<User[]>([]);
    const loggedUser = useAuth().user;
    const loading = useAuth().loading;
    
    useEffect(() => {
        const fetchProfesionals = async () => {
            const fetchedProfesionals = await profesionalServices.getAllProfesionals();
            setProfesionals(fetchedProfesionals);
        };
        fetchProfesionals();
    }, []);
    
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="home-container">
            <Navbar userId={loggedUser.id} />
            <div className="home-header">
                <h2>Bienvenido {loggedUser.name}</h2>
                {loggedUser.role === "profesional" && <Link to={`/profesionals/${loggedUser.id}/schedule`} className='home-update-link'>Editar mi horario</Link>}
            </div>
            <ul className='home-profesional-list'>
                {profesionals.map((profesional) => (
                    <li key={profesional.id} className='home-profesional-item'>
                        {profesional.name}{" "}
                        <Link to={`/profesionals/${profesional.id}/schedule`} className='home-link'>
                            Ver horario
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;