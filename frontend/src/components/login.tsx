import { useState } from "react";
import userServices from "../services/user";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();

    const [usernameLogin, setUsernameLogin] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");

    const handleUserLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user: Promise<User | null> = userServices.getUserByUsername(usernameLogin);
        user.then((data) => {
            if (data?.password === passwordLogin) {
                console.log("Usuario y contraseña correctos");
                // ir a la vista del horario
            }
            else {
                alert("Usuario o contraseña incorrectos");
            }
        })
        .catch (err => console.error(err));

        setUsernameLogin("");
        setPasswordLogin("");
    }

    
    return (
        <div>
            <h2>Inicio de sesión en Horario</h2>
            <form onSubmit={handleUserLogin}>
                <input type="text" placeholder="Usuario" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} />
                <button type="submit">Iniciar sesión</button>
            </form>
            <br />
            <button onClick={() => navigate('/register')}>¿No tienes cuenta? Regístrate</button>
        </div>
    )
}

export default Login;