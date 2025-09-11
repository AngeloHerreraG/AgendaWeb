import { useState } from 'react'
import './App.css'

interface User {
    id: number
    name: string
    password: string
}

function App() {
    const [patients, setPatients] = useState<User[]>([])
    const [doctores, setDoctors] = useState<User[]>([])

    fetch('http://localhost:9002/patients')
        .then(res => res.json())
        .then(data => setPatients(data))
        .catch(err => console.error(err))

    fetch('http://localhost:9002/doctors')
        .then(res => res.json())
        .then(data => setDoctors(data))
        .catch(err => console.error(err))

    return (
        <div>
            <h1>Hello World!</h1>
            <h2>Pacientes desde el backend:</h2>
            <ul>
                {patients.map(patient => (
                    <li key={patient.id}>{patient.name}, {patient.password}</li>
                ))}
            </ul>
            <h2>Doctores desde el backend:</h2>
            <ul>
                {doctores.map(doctor => (
                    <li key={doctor.id}>{doctor.name}, {doctor.password}</li>
                ))}
            </ul>
        </div>
    )
}

export default App
