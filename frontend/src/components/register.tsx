import { useState } from "react";
import userServices from "../services/user";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [usernameRegister, setUsernameRegister] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");


    const handleUserRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = userServices.getUserByUsername(usernameRegister);

        user.then((data) => {
            if (data) {
                alert("El usuario ya existe");
            } else {
                const newUser: Omit<User, 'id'> = {
                    name: usernameRegister,
                    password: passwordRegister,
                    role: 'patient'
                };

                userServices.createUser(newUser)
                    .then((data) => {
                        console.log("Usuario registrado:", data);
                        navigate('/login');
                    })
                    .catch((err) => console.error(err));
            }
        })
        .catch((err) => console.error(err));

        setUsernameRegister("");
        setPasswordRegister("");
    }

    return (
        <div>
            <h2>Regístrate en Horario</h2>
            <form onSubmit={handleUserRegister}>
                <input type="text" placeholder="Usuario" value={usernameRegister} onChange={(e) => setUsernameRegister(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)} />
                <button type="submit">Registrarse</button>
            </form>
            <br />
            <button onClick={() => navigate('/login')}>¿Ya tienes cuenta? Inicia sesión</button>
        </div>

        
    )
}

export default Register;