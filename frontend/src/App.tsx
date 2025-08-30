import { useState } from 'react'
import './App.css'

interface User {
    id: number
    name: string
}

function App() {
    const [users, setUsers] = useState<User[]>([])


    fetch('http://localhost:9002/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error(err))


    return (
        <div>
            <h1>Hello World!</h1>
            <h2>Usuarios desde el backend:</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default App
