import { useState } from "react";
import userServices from "../services/user";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";


const Login = () => {
    const { login } = useAuth();

    const navigate = useNavigate();

    const [usernameLogin, setUsernameLogin] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");

    const handleUserLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user: Promise<User | null> = userServices.getUserByUsername(usernameLogin);
        user.then((data) => {
            if (data?.password === passwordLogin) {
                console.log("Usuario y contraseña correctos");
                login(data);
                // ir a la vista del horario
                navigate(`/home/${data.id}`);
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
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="text"
                        placeholder="Usuario"
                        value={usernameLogin}
                        onChange={(e) => setUsernameLogin(e.target.value)}
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