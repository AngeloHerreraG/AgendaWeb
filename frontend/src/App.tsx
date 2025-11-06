import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import './App.css'
import Home from './components/home'
import Horario from './components/horario'
import Profile from './components/profile/profile'
import { AuthProvider } from './auth/auth'

function App() {

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/home/:id" element={<Home />} />
                    <Route path="/profesionals/:id/schedule" element={<Horario />} />
                    <Route path="/profile/:id" element={<Profile />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
