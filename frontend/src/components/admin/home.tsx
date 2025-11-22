import type { Professional } from "../../types/user";
import { useState } from "react";
import { Navigate } from 'react-router'
import "../../styles/adminHome.css";
import userServices from "../../services/user"
import professionalServices from "../../services/professional"

import { useAuthStore } from '../store/authStore'

const HOUR_OPTIONS = Array.from({ length: 13 }, (_, i) => i+8);
const BLOCK_OPTIONS = [1, 2, 3, 4, 6];

const ClientProfile = () => {
    const [emailRegister, setEmailRegister] = useState<string>("");
    const [passwordRegister, setPasswordRegister] = useState<string>("");
    const [nameRegister, setNameRegister] = useState<string>("");
    const [birthDateRegister, setBirthDateRegister] = useState<string>("");
    const [specialityRegister, setSpecialityRegister] = useState<string>("");
    const [descriptionRegister, setDescriptionRegister] = useState<string>("");

    const [daysRegister, setDaysRegister] = useState<string[]>([]);
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const [blocksPerHourRegister, setBlocksPerHourRegister] = useState<number>(2);
    const [startHourRegister, setStartHourRegister] = useState<number>(9);
    const [endHourRegister, setEndHourRegister] = useState<number>(17);

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
                const newProfessional: Partial<Professional> = {
                        name: nameRegister,
                        email: emailRegister,
                        password: passwordRegister,
                        birthDate: birthDateRegister,
                        speciality: specialityRegister,
                        description: descriptionRegister,
                        disponibility: {
                            days: daysRegister,
                            blocksPerHour: Number(blocksPerHourRegister),
                            startHour: Number(startHourRegister),
                            endHour: Number(endHourRegister)
                        }
                    };
                    await professionalServices.createProfessional(newProfessional);

                alert("Usuario nuevo registrado")

                // Limpiar campos
                setEmailRegister("");
                setPasswordRegister("");
                setNameRegister("");
                setBirthDateRegister("");
                setSpecialityRegister("");
                setDescriptionRegister("");
                setDaysRegister([]);
                setBlocksPerHourRegister(2);
                setStartHourRegister(9);
                setEndHourRegister(17);
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Añadir Profesionales</h2>

                <form onSubmit={handleUserRegister} className="register-form">
                    {/* IZQUIERDA */}
                    <div className="register-left">
                        <input className="register-input" type="text" placeholder="Nombre" value={nameRegister} onChange={(e) => setNameRegister(e.target.value)} minLength={3} required />
                        <input className="register-input" type="email" placeholder="Email" value={emailRegister} onChange={(e) => setEmailRegister(e.target.value)} required />
                        <input className="register-input" type="date" value={birthDateRegister} onChange={(e) => setBirthDateRegister(e.target.value)} required />
                        <input className="register-input" type="password" placeholder="Contraseña" value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)} minLength={8} maxLength={20} />

                        <input className="register-input" type="text" placeholder="Especialidad" value={specialityRegister} onChange={(e) => setSpecialityRegister(e.target.value)} />
                        <textarea className="register-textarea" placeholder="Descripción" value={descriptionRegister} onChange={(e) => setDescriptionRegister(e.target.value)} rows={5} />

                        <button className="register-button" type="submit">Registrar</button>
                    </div>

                    {/* DERECHA */}
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
                        <div className='schedule-form-input-group'>
                                    <label htmlFor='start-time'>Hora Inicio</label>
                                    <select
                                        id='start-time'
                                        value={startHourRegister}
                                        onChange={(e) => setStartHourRegister(Number(e.target.value))}
                                    >
                                        {HOUR_OPTIONS.map(hour => (
                                            <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='schedule-form-input-group'>
                                    <label htmlFor='end-time'>Hora Fin</label>
                                    <select
                                        id='end-time'
                                        value={endHourRegister}
                                        onChange={(e) => setEndHourRegister(Number(e.target.value))}
                                    >
                                        {HOUR_OPTIONS.map(hour => (
                                            <option key={hour} value={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='schedule-form-input-group'>
                                    <label htmlFor='blocks'>Bloques/Hora</label>
                                    <select
                                        id='blocks'
                                        value={blocksPerHourRegister}
                                        onChange={(e) => setBlocksPerHourRegister(Number(e.target.value))}
                                    >
                                        {BLOCK_OPTIONS.map(block => (
                                            <option key={block} value={block}>{block}</option>
                                        ))}
                                    </select>
                                </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default ClientProfile;