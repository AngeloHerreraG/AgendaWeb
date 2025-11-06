import { useState } from "react";
import clientServices from "../services/client";
import userServices from "../services/user";
import type { Client } from "../types/user";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [emailRegister, setEmailRegister] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");
    const [nameRegister, setNameRegister] = useState<string>("");
    const [birthDateRegister, setBirthDateRegister] = useState<string>("");

    const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await userServices.getUserByEmail(emailRegister);

        if (response.message === "User already exists") {
            alert("El email ya está registrado. Por favor, utiliza otro email.");
        }

        else {
            try {
                const newUser: Omit<Client, 'id'> = {
                    name: nameRegister,
                    email: emailRegister,
                    password: passwordRegister,
                    birthDate: birthDateRegister,
                    role: 'client'
                };
                await clientServices.createClient(newUser);
                navigate('/login');
            }
            catch (err) {
                console.error(err);
            }
        }

        setEmailRegister("");
        setPasswordRegister("");
        setNameRegister("");
        setBirthDateRegister("");
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
                        placeholder="Nombre" 
                        value={nameRegister} 
                        onChange={(e) => setNameRegister(e.target.value)} 
                        minLength={3}
                        required
                    />
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="text" 
                        placeholder="Email" 
                        value={emailRegister} 
                        onChange={(e) => setEmailRegister(e.target.value)} 
                        minLength={3}
                        required
                    />
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="date" 
                        placeholder="Fecha de nacimiento" 
                        value={birthDateRegister} 
                        onChange={(e) => setBirthDateRegister(e.target.value)} 
                        required
                    />
                    <input style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "20px" }}
                        type="password" 
                        placeholder="Contraseña" 
                        value={passwordRegister} 
                        onChange={(e) => setPasswordRegister(e.target.value)} 
                        minLength={8}
                        maxLength={20}
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