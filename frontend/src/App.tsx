import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import './App.css'
import Home from './components/home'
import Horario from './components/horario'
import Profile from './components/profile/profile'
import { AuthProvider } from './auth/auth'
import AdminHome from './components/admin/home'

function App() {

    return (
        <AuthProvider>
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
        </AuthProvider>
    )
}

export default App
