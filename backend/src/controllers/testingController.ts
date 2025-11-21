import express from "express";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/users";
import ScheduleModel from "../models/schedule";

const router = express.Router();

const initialUsers = [
    {
        "name": "Admin Admin",
        "email": "admin@gmail.com",
        "passwordHash": "$2b$11$/mudeDAphuCeLYMGqwlC6u2iamuVhGYD/sjX7WNQKEQH4YMQzw2EO",
        "birthDate": new Date("2001-12-03T00:00:00.000Z"),
        "schedules": [],
        "role": "admin"
    },
    {
        "name": "vicente leyton",
        "email": "vicenteleyton@gmail.com",
        "passwordHash": "$2b$11$Qc58Ma48jcHg5McqSlxlIeQ9YIqE5lwqw130QEUBwDaKqXmip7L6a",
        "birthDate": new Date("2003-03-22T00:00:00.000Z"),
        "schedules": [],
        "role": "client"
    },
    {
        "name": "angelo herrera",
        "email": "angeloherrera@gmail.com",
        "passwordHash": "$2b$11$WtUAE7GGe4Ly3/XMgNoGlOKLrODGSI6VfrunH/JwLlFKYLvCmXQIG",
        "birthDate": new Date("2002-08-14T00:00:00.000Z"),
        "schedules": [],
        "role": "professional",
        "speciality": "Frontend",
        "description": "Ingeniero Civil en Computación de la Universidad de Chile, especializado en desarrollo de software.",
        "interests": [
            "OSU",
            "Clash Royale"
        ],
        "disponibility": {
            "days": [
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves"
            ],
            "startHour": 10,
            "endHour": 13,
            "blocksPerHour": 3
        }
    },
    {
        "name": "andres salazar",
        "email": "andres123@gmail.com",
        "passwordHash": "$2b$11$rcQL0VWlNJhHbRAhnD7HledYC31fHrXhMI8mGFD5.BCWvGyiW/Rfu",
        "birthDate": new Date("2001-10-03T00:00:00.000Z"),
        "schedules": [],
        "role": "professional",
        "speciality": "Backend",
        "description": "Desarrollador backend con experiencia en Node.js y bases de datos.",
        "interests": [
            "Node.js",
            "Bases de datos"
        ],
        "disponibility": {
            "days": [
                "Viernes",
                "Sábado",
                "Domingo"
            ],
            "startHour": 20,
            "endHour": 23,
            "blocksPerHour": 2
        }
    }
];

const reset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserModel.deleteMany({});
        await ScheduleModel.deleteMany({});
        await UserModel.insertMany(initialUsers);
        
        res.status(200).json({ message: 'Database reset successfully' });
    } catch (error) {
        next(error);
    }
};

router.post("/reset", reset);

export default router;