import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import './App.css'
import Home from './components/home'
import Horario from './components/horario'
import Profile from './components/profile'
import { AuthProvider } from './auth/auth'
import { useEffect, useState } from 'react'
import loginService from './services/login'
import type { User } from './types/user'

function App() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await loginService.restoreLogin();
            setUser(user);
        };
        init();
    }, []);

    // Hacer que el user esté disponible en todo el app

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/home/:id" element={<Home />} />
                    <Route path="/doctors/:id/schedule" element={<Horario />} />
                    <Route path="/profile/:id" element={<Profile />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
