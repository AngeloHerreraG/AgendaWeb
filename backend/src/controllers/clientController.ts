import { Request, Response, NextFunction } from 'express';
import express from "express"
import bcrypt from 'bcrypt';
import ClientModel from '../models/client';
import ProfesionalModel from '../models/profesional';

const router = express.Router();

const createClient = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, email, password, birthDate } = req.body;

        // Regex for name validation
        const nameRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,;:!?()'"%\-–—/@#&+\s]{3,20}$/;
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
        const existingUser = await ClientModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
        }

        // Verify that birthDate is a valid date
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(birthDate).getFullYear();

        if (isNaN(Date.parse(birthDate)) ||
            actualYear - birthYear < 12 ) {
            res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }

        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new ClientModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
        });

        await newUser.save();
        
        
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            birthDate: newUser.birthDate
        });
    }

    catch (error) {
        next(error);
    }  
};

const getClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await ClientModel.find({}).populate('schedules', {
            profesionalId: 1,
            startDate: 1,
            finishDate: 1,
            status: 1,
            notes: 1
        });

        res.json(users);

    } catch (error) {
        next(error);
    }
};

router.post('/', createClient);
router.get('/', getClients);

export default router;
