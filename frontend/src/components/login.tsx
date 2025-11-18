import { useState } from "react";
// import loginService from "../services/login";
import { Navigate, useNavigate } from "react-router-dom";
// import type { User } from "../types/user";

import { useAuthStore } from './store/authStore'

const Login = () => {
    const { login, user: loggedUser, authStatus } = useAuthStore();

    const navigate = useNavigate();

    const [emailLogin, setEmailLogin] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");

    const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login({ email: emailLogin, password: passwordLogin });
        } catch (error) {
            console.error("Wrong credentials", error);
            alert("Credenciales incorrectas. Inténtalo de nuevo.");
        }
    }

    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    if (loggedUser) {
        return <Navigate to={`/home/${loggedUser.id}`} replace />;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px",
            backgroundColor: "#f5ececff", height: "100vh" }}>

            {/* Columna izquierda, logo y frase de la app */}
            <div style={{ textAlign: "left", marginBottom: "150px" }}>
                <img
                    src="/Abba.png"
                    alt="Abba"
                    style={{ transform: "scale(0.5)", display: "block", margin: "0 0 -20px -80px" }}
                />
                <h2 style={{ margin: "0", fontFamily: "Arial, sans-serif" }}>
                    Organiza tu tiempo, <br /> simplifica tu vida
                </h2>
            </div>

            {/* Columna derecha: formulario */}
            <div style={{ backgroundColor: "#ffffffff", padding: "20px", borderRadius: "4px", marginBottom: "150px" }}>
                <form onSubmit={handleUserLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "250px" }}>
                    {/* Crear campos de seleccion  entre cliente o profesional */}
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="text"
                        placeholder="Email"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        minLength={1}
                    />
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="password"
                        placeholder="Contraseña"
                        value={passwordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        minLength={8}
                    />
                    <button style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "40px", cursor: "pointer", color: "white", backgroundColor: "#4CAF50" }} 
                        type="submit">
                            Iniciar sesión
                    </button>
                    <button style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "40px", marginTop: "10px", color: "white", backgroundColor: "#171ae1ff", cursor: "pointer" }}
                        type="button" onClick={() => navigate("/register")}>
                            ¿No tienes cuenta? Regístrate
                    </button>
                </form>
            </div>

            <div>
                <h4>
                    
                </h4>
            </div>
        </div>
    )
}

export default Login;