// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
//import HorarioComponent from './components/horario'
import Login from './components/login'
import Register from './components/register'
import './App.css'
import Home from './components/home'
//import Horario from './services/horario'

function App() {
    // const [patients, setPatients] = useState<User[]>([])
    // const [doctores, setDoctors] = useState<User[]>([])

    // fetch('http://localhost:9002/users')
    //     .then(res => res.json())
    //     .then(data => setPatients(data))
    //     .catch(err => console.error(err))

    // fetch('http://localhost:9002/doctors')
    //     .then(res => res.json())
    //     .then(data => setDoctors(data))
    //     .catch(err => console.error(err))

    // return (
    //     <div>
    //         <h1>Hello World!</h1>
    //         <div style={{ display: 'flex', gap: '100px'}}>
    //             {/* Este simularia ser la vista del profesional */}
    //             <Horario professionalId={2} isProfessional={true}/>
    //             {/* Esta simularia ser la vista del paciente con id 3 */}
    //             <Horario professionalId={2} isProfessional={false} userId={3}/>
    //         </div>
    //         {/* <h2>Pacientes desde el backend:</h2>
    //         <ul>
    //             {patients.map(patient => (
    //                 <li key={patient.id}>{patient.name}, {patient.password}</li>
    //             ))}
    //         </ul>
    //         <h2>Doctores desde el backend:</h2>
    //         <ul>
    //             {doctores.map(doctor => (
    //                 <li key={doctor.id}>{doctor.name}, {doctor.password}</li>
    //             ))}
    //         </ul> */}
    //     </div>
    // )

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/home/:id" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default App
