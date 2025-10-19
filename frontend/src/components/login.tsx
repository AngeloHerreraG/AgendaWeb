import { useState } from "react";
import loginService from "../services/login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth";


const Login = () => {
    const { login } = useAuth();

    const navigate = useNavigate();

    const [emailLogin, setEmailLogin] = useState<string>("");
    const [passwordLogin, setPasswordLogin] = useState<string>("");

    const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user = await loginService.login({
                email: emailLogin,
                password: passwordLogin,
            });

            login(user);
            setEmailLogin("");
            setPasswordLogin("");
            navigate(`/home/${user?.id}`);

        } catch (error) {
            console.error("Wrong credentials", error);
        }
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