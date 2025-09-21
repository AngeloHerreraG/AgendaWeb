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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            backgroundColor: "#f5ececff", height: "100vh" }}>
            <img style={{ height: "180px" }}
                src="/AbbaSchedule.png" alt="Abba" />
            <div style={{ backgroundColor: "#ffffffff", padding: "20px", borderRadius: "4px", marginBottom: "150px" }}>
                <h2 style={{ margin: "0px", textAlign: "center", marginBottom: "30px", fontSize: "26px", fontFamily: "Arial, sans-serif" }}>Crea tu cuenta</h2>
                <form onSubmit={handleUserRegister} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "250px" }}>
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="text" 
                        placeholder="Usuario" 
                        value={usernameRegister} 
                        onChange={(e) => setUsernameRegister(e.target.value)} 
                        minLength={1}
                    />
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="password" 
                        placeholder="Contraseña" 
                        value={passwordRegister} 
                        onChange={(e) => setPasswordRegister(e.target.value)} 
                        minLength={8}
                    />
                    <button style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "40px", color: "white", backgroundColor: "#171ae1ff", cursor: "pointer" }}
                        type="submit">Registrarse</button>
                    <button style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "40px", marginTop: "10px", color: "white", backgroundColor: "#3866e6ff", cursor: "pointer" }}
                        type="button" onClick={() => navigate('/login')}>
                            ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;