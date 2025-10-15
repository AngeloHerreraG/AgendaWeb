import { Request, Response, NextFunction } from 'express';
import express from "express"
import bcrypt from 'bcrypt';
import UserModel from '../models/client';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

const createClient = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, email, password, birthDate } = req.body;
        const role = 'client'; // Default role for new clients

        // Regex for name validation
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,50}$/;
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
        const existingUser = await UserModel.findOne({ email });
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

        const newUser = new UserModel({
            name,
            email,
            passwordHash,
            birthDate,
            schedules: [],
            role
        });

        await newUser.save();
        return newUser;
        }

    catch (error) {
        next(error);
    }  
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find({}).populate('schedules', {
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

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findById(req.params.id).populate('schedules', {
            profesionalId: 1,
            startDate: 1,
            finishDate: 1,
            status: 1,
            notes: 1
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
};


router.post('/users', createClient);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

export default router;
