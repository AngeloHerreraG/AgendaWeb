
import { Request, Response, NextFunction } from 'express';
import express from "express"
import bcrypt from 'bcrypt';
import { UserModel } from '../models/users';

const router = express.Router();

const createClient = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, email, password, birthDate } = req.body;

        // Required fields
        if (!name) return res.status(400).json({ error: 'Name is required' });
        if (!email) return res.status(400).json({ error: 'Email is required' });
        if (!password) return res.status(400).json({ error: 'Password is required' });
        if (!birthDate) return res.status(400).json({ error: 'Birth date is required' });

        // Regex for name validation
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,20}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ error: 'Name not valid' });
        }

        // Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // If email already exists, return an error
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Basic password strength check
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Verify that birthDate is a valid date and age >= 12
        const parsed = Date.parse(birthDate);
        if (isNaN(parsed)) {
            return res.status(400).json({ error: 'Invalid birth date format' });
        }
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(parsed).getFullYear();

        if (actualYear - birthYear < 12) {
            return res.status(400).json({ error: 'Age restriction not satisfied (must be at least 12 years old)' });
        }

        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new UserModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(parsed),
            role: "client"
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
        const users = await UserModel.find({ role: "client" }).populate('schedules', {
            professionalId: 1,
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

const updateClientInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.id;
        const updatedInfo = req.body;
    
        const updatedClient = await UserModel.findByIdAndUpdate(
            clientId,
            updatedInfo,
            { new: true }
        );
        res.status(200).json(updatedClient);
    } catch (error) {
        next(error);
    }
};

router.post('/', createClient);
router.get('/', getClients);
router.patch('/info/:id', updateClientInfo);

export default router;
