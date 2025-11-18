import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './components/login'
import Register from './components/register'
import Home from './components/home'
import Horario from './components/horario'
import Profile from './components/profile/profile'
import AdminHome from './components/admin/home'
import './App.css'

import { useAuthStore } from './components/store/authStore'

function App() {

    useEffect(() => {
        // Al montar la aplicación, verificamos si el usuario ya está autenticado
        useAuthStore.getState().checkAuth();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/home/:id" element={<Home />} />
                <Route path="/professional/:id" element={<Horario />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/admin-home" element={<AdminHome />} />
            </Routes>
        </Router>
    )
}

export default App
