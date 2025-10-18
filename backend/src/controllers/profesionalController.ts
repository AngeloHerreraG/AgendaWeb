import { Request, Response, NextFunction } from 'express';
import express from "express"
import ProfesionalModel from '../models/profesional';
import bcrypt from 'bcrypt';
import {authenticate, authorize } from '../middleware/authMiddleware';
import { ProfesionalDisponibility } from '../models/profesional';

const router = express.Router();

const createProfesional = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, birthDate, speciality, description, interests, disponibility } = req.body;

        // Regex for name validation
        const nameRegex = /^(?!.*\s{2,})[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+){0,5}$/;
        if (!nameRegex.test(name)) {
            res.status(400).json({ error: 'Name not valid' });
        }

        // Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // If the email input is not valid, return an error
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
        }

        // If email already exists, return an error
        const existingUser = await ProfesionalModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
        }

        // Verify that birthDate is a valid date
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(birthDate).getFullYear();

        if (isNaN(Date.parse(birthDate)) ||
            actualYear - birthYear < 18 ) {
            res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }

        const textRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,;:!?()'"%\-–—/@#&+\s]{3,1000}$/;

        if (!textRegex.test(speciality) || !textRegex.test(description)) {
            res.status(400).json({ error: 'Speciality or description not valid' });
        }

        if (!Array.isArray(interests) || interests.some(interest => !textRegex.test(interest))) {
            res.status(400).json({ error: 'Interests must be an array of valid strings' });
        }

        if (disponibility) {
            const { days, blocksPerHour, startHour, endHour } = disponibility;
            if (!Array.isArray(days) || days.some((day: any) => typeof day !== 'string')) {
                res.status(400).json({ error: 'Disponibility days must be an array of strings' });
            }
            if (typeof blocksPerHour !== 'number' || typeof startHour !== 'number' || typeof endHour !== 'number') {
                res.status(400).json({ error: 'Disponibility hours must be numbers' });
            }
        }

        const disponibilityData = disponibility as ProfesionalDisponibility | undefined;

        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newProfesional = new ProfesionalModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
            speciality,
            description,
            interests,
            disponibility: disponibilityData
        });

        await newProfesional.save();
        res.status(201).json(newProfesional);

    } catch (error) {
        next(error);
    }
};

const getProfesionals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profesionals = await ProfesionalModel.find({});
        res.json(profesionals);
    } catch (error) {
        next(error);
    }
};

const getProfesionalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profesional = await ProfesionalModel.findById(req.params.id);
        if (!profesional) {
            return res.status(404).json({ error: 'Profesional not found' });
        }

        res.json(profesional);

    } catch (error) {
        next(error);
    }
};

const changeProfesionalDisponibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profesionalId = req.params.id;
        const { disponibility } = req.body;

        if (profesionalId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this profesional' });
        }

        // Validate the new disponibility data
        if (disponibility) {
            const { days, blocksPerHour, startHour, endHour } = disponibility;

            if (!Array.isArray(days) || days.some((day: any) => typeof day !== 'string')) {
                return res.status(400).json({ error: 'Disponibility days must be an array of strings' });
            }
            if (typeof blocksPerHour !== 'number' || typeof startHour !== 'number' || typeof endHour !== 'number') {
                return res.status(400).json({ error: 'Disponibility hours must be numbers' });
            }
        }

        await ProfesionalModel.findByIdAndUpdate(profesionalId, { disponibility }, { new: true });
        res.status(200).json({ message: 'Disponibility updated successfully' });

    } catch (error) {
        next(error);
    }
};

router.post('/', authenticate, authorize(['admin']), createProfesional);
router.get('/', getProfesionals);
router.get('/:id', getProfesionalById);
router.put('/:id/disponibility', authenticate, authorize(['profesional']), changeProfesionalDisponibility);

export default router;