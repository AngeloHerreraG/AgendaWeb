import type { Client, Professional } from "../../types/user";
import { useState } from "react";
import { Navigate } from 'react-router'
import "../../styles/adminHome.css";
import userServices from "../../services/user"
import clientServices from "../../services/client"
import professionalServices from "../../services/professional"

import { useAuthStore } from '../store/authStore'


const ClientProfile = () => {
    const [emailRegister, setEmailRegister] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");
    const [nameRegister, setNameRegister] = useState<string>("");
    const [birthDateRegister, setBirthDateRegister] = useState<string>("");
    const [roleRegister, setRoleRegister] = useState<string>("");
    const [specialityRegister, setSpecialityRegister] = useState<string>("");
    const [descriptionRegister, setDescriptionRegister] = useState<string>("");

    const [daysRegister, setDaysRegister] = useState<string[]>([]);
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const [blockPerHourRegister, setBlockPerHourRegister] = useState<string>("");
    const [startHourRegister, setStartHourRegister] = useState<string>("");
    const [endHourRegister, setEndHourRegister] = useState<string>("");

    const {user: loggedUser, authStatus} = useAuthStore();
    
    if (authStatus === "loading") {
        return <div>Cargando...</div>;
    }

    if (!loggedUser || authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (day: string) => {
        setDaysRegister((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day) // si ya estaba, lo quita
                : [...prev, day] // si no estaba, lo agrega
        );
    };


    const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await userServices.getUserByEmail(emailRegister);

        if (response.message === "User already exists") {
            alert("El email ya está registrado. Por favor, utiliza otro email.");
        }

        else {
            try {
                if (roleRegister === 'client') {
                    const newUser: Partial<Client> = {
                        name: nameRegister,
                        email: emailRegister,
                        password: passwordRegister,
                        birthDate: birthDateRegister,
                    };
                    await clientServices.createClient(newUser);
                }
                else if (roleRegister === 'professional') {
                    const newProfessional: Partial<Professional> = {
                        name: nameRegister,
                        email: emailRegister,
                        password: passwordRegister,
                        birthDate: birthDateRegister,
                        speciality: specialityRegister,
                        description: descriptionRegister,
                        disponibility: {
                            days: daysRegister,
                            blocksPerHour: Number(blockPerHourRegister),
                            startHour: Number(startHourRegister),
                            endHour: Number(endHourRegister)
                        }
                    };
                    await professionalServices.createProfessional(newProfessional);
                }

                alert("Usuario nuevo registrado")

                // Limpiar campos
                setEmailRegister("");
                setPasswordRegister("");
                setNameRegister("");
                setBirthDateRegister("");
                setSpecialityRegister("");
                setDescriptionRegister("");
                setDaysRegister([]);
                setBlockPerHourRegister("");
                setStartHourRegister("");
                setEndHourRegister("");
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Crea tu cuenta</h2>

                <form onSubmit={handleUserRegister} className="register-form">
                    {/* IZQUIERDA */}
                    <div className="register-left">
                        <select
                        className="register-select"
                        value={roleRegister}
                        onChange={(e) => setRoleRegister(e.target.value)}
                        required
                        >
                        <option value="" disabled>Selecciona un rol</option>
                        <option value="client">Cliente</option>
                        <option value="professional">Profesional</option>
                        </select>

                        <input className="register-input" type="text" placeholder="Nombre" value={nameRegister} onChange={(e) => setNameRegister(e.target.value)} minLength={3} required />
                        <input className="register-input" type="email" placeholder="Email" value={emailRegister} onChange={(e) => setEmailRegister(e.target.value)} required />
                        <input className="register-input" type="date" value={birthDateRegister} onChange={(e) => setBirthDateRegister(e.target.value)} required />
                        <input className="register-input" type="password" placeholder="Contraseña" value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)} minLength={8} maxLength={20} />

                        {roleRegister === "professional" && (
                        <>
                            <input className="register-input" type="text" placeholder="Especialidad" value={specialityRegister} onChange={(e) => setSpecialityRegister(e.target.value)} />
                            <textarea className="register-textarea" placeholder="Descripción" value={descriptionRegister} onChange={(e) => setDescriptionRegister(e.target.value)} rows={5} />
                        </>
                        )}
                        <button className="register-button" type="submit">Registrar</button>
                    </div>

                    {/* DERECHA */}
                    {roleRegister === "professional" && (
                        <div className="register-right">
                            <p>Seleccione los días disponibles</p>
                            <div className="register-days">
                                {days.map((day) => (
                                <label key={day}>
                                    <input
                                    type="checkbox"
                                    value={day}
                                    checked={daysRegister.includes(day)}
                                    onChange={() => handleChange(day)}
                                    />
                                    {` ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                                </label>
                                ))}
                            </div>
                            <input className="register-input" type="number" placeholder="Bloques por hora" value={blockPerHourRegister} onChange={(e) => setBlockPerHourRegister(e.target.value)} />
                            <input className="register-input" type="number" placeholder="Hora de comienzo" value={startHourRegister} onChange={(e) => setStartHourRegister(e.target.value)} />
                            <input className="register-input" type="number" placeholder="Hora de término" value={endHourRegister} onChange={(e) => setEndHourRegister(e.target.value)} />
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
};

export default ClientProfile;