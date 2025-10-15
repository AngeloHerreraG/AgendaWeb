import { Request, Response, NextFunction } from 'express';
import express from "express"
import ProfesionalModel from '../models/profesional';

const router = express.Router();

const createProfesional = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, speciality, description, birthDate } = req.body;
        const role = 'profesional'; // Default role for new professionals
        // Aqui falta continuar.
    }

    catch (error) {
        next(error);
    }
};

export default router;