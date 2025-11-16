import { Request, Response, NextFunction } from 'express';
import express from "express"
import { ProfesionalModel } from '../models/users';
import bcrypt from 'bcrypt';
import {authenticate, authorize } from '../middleware/authMiddleware';

const router = express.Router();

const createProfesional = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name, email, password, birthDate, speciality, description,
            interests, disponibility
        } = req.body;

        const { days, blocksPerHour, startHour, endHour } = disponibility;

        // Required fields
        if (!name) return res.status(400).json({ error: 'Name is required' });
        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!password) return res.status(400).json({ error: 'Password is required' });
        if (!birthDate) return res.status(400).json({ error: 'Birth date is required' });
        if (!speciality) return res.status(400).json({ error: 'speciality is required' });
        if (!description) return res.status(400).json({ error: 'description is required' });
        if (!days) return res.status(400).json({ error: 'days is required' });
        if (!blocksPerHour) return res.status(400).json({ error: 'blocksPerHour is required' });
        if (!startHour) return res.status(400).json({ error: 'startHour is required' });
        if (!endHour) return res.status(400).json({ error: 'endHour is required' });

        // Regex for name validation
        const nameRegex = /^(?!.*\s{2,})[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+){0,5}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: 'Name not valid' });
        }

        // Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // If the email input is not valid, return an error
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // If email already exists, return an error
        const existingUser = await ProfesionalModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Verify that birthDate is a valid date
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(birthDate).getFullYear();

        if (isNaN(Date.parse(birthDate)) ||
            actualYear - birthYear < 18 ) {
            return res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }

        const textRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,;:!?()'"%\-–—/@#&+\s]{3,1000}$/;

        if (!textRegex.test(speciality) || !textRegex.test(description)) {
            return res.status(400).json({ error: 'Speciality or description not valid' });
        }

        if (interests) {
            if (!Array.isArray(interests) || interests.some(interest => !textRegex.test(interest))) {
                return res.status(400).json({ error: 'Interests must be an array of valid strings' });
            }
        }

        if (!Array.isArray(days) || days.some((day: any) => typeof day !== 'string')) {
            return res.status(400).json({ error: 'Disponibility days must be an array of strings' });
        }

        if (typeof blocksPerHour !== 'number' || typeof startHour !== 'number' || typeof endHour !== 'number') {
            return res.status(400).json({ error: 'Disponibility hours must be numbers' });
        }
        
        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newProfesional = new ProfesionalModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
            role: "profesional",
            speciality,
            description,
            interests,
            disponibility: {
                days,
                blocksPerHour,
                startHour,
                endHour
            }
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

router.post('/', createProfesional);
router.get('/', getProfesionals);
router.put('/:id/disponibility', authenticate, authorize(['profesional']), changeProfesionalDisponibility);

// Insertamos un profesional para probar
const addprofesional = async () => {

    const insertTestProfesional = new ProfesionalModel({
        name: "Dr. Test Profesional",
        email: "b@b.b",
        passwordHash: await bcrypt.hash("12345678", 11),
        birthDate: new Date("1980-01-01"),
        speciality: "Medicina General",
        description: "Profesional de prueba para testing.",
        interests: ["Salud", "Bienestar"],
        disponibility: {
            days: ["Monday", "Wednesday", "Friday"],
            blocksPerHour: 4,
            startHour: 9,
            endHour: 17
        }
    });
    insertTestProfesional.save().then(() => {
        console.log("Test profesional inserted");
    }).catch((error) => {
        console.error("Error inserting test profesional:", error);
    });
};

// addprofesional();

export default router;