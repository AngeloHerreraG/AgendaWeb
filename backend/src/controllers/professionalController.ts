import express, { Request, Response, NextFunction } from 'express';
import { professionalModel } from '../models/users';
import bcrypt from 'bcrypt';
import {authenticate, authorize } from '../middleware/authMiddleware';
import { validateName, validateEmail, validateBirthDate, validateSpecialityDescriptionAndInterests } from '../utils/validation';

const router = express.Router();

const createprofessional = async (req: Request, res: Response, next: NextFunction) => {
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

        // Validate name
        if (!validateName(name)) {
            return res.status(400).json({ error: 'Name not valid' });
        }
        // Validate email
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // If email already exists, return an error
        const existingUser = await professionalModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        // Validate birth date
        if (!validateBirthDate(birthDate)) {
            return res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }
        // Validate speciality, description and interests
            if (!validateSpecialityDescriptionAndInterests(speciality) || !validateSpecialityDescriptionAndInterests(description)) {
            return res.status(400).json({ error: 'Speciality or description not valid' });
        }

        if (interests) {
            if (!Array.isArray(interests) || interests.some(interest => !validateSpecialityDescriptionAndInterests(interest))) {
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

        const newprofessional = new professionalModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
            role: "professional",
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

        await newprofessional.save();
        res.status(201).json(newprofessional);

    } catch (error) {
        next(error);
    }
};

const getprofessionals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionals = await professionalModel.find({}).sort({ name: 1 });
        
        res.json(professionals);
    } catch (error) {
        next(error);
    }
};

const getprofessionalsFilter = async (req: Request, res: Response, next: NextFunction) => {
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWith = escapeRegex(req.query.startsWith as string);
    const specialty = escapeRegex(req.query.specialty as string);

    try {
        const professionals = await professionalModel.find({ 
            name: { $regex: `^${startsWith}`, $options: 'i' },
            speciality: { $regex: `^${specialty}`, $options: 'i' } 
        }).sort({ name: 1 });

        res.json(professionals);
    } catch (error) {
        next(error);
    }
};

const updateprofessionalSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionalId = req.params.id;
        const { disponibility } = req.body;

        if (professionalId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this professional' });
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

        await professionalModel.findByIdAndUpdate(professionalId, { disponibility }, { new: true });
        res.status(200).json({ message: 'Disponibility updated successfully' });

    } catch (error) {
        next(error);
    }
};

const updateProfessionalInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionalId = req.params.id;
        const updatedInfo = req.body;

        if (professionalId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this professional' });
        }

        // Validate fields
        if (updatedInfo.name && !validateName(updatedInfo.name)) {
            return res.status(400).json({ error: 'Name not valid' });
        }
        if (updatedInfo.email && !validateEmail(updatedInfo.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (updatedInfo.birthDate && !validateBirthDate(updatedInfo.birthDate)) {
            return res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }
        if (updatedInfo.speciality && !validateSpecialityDescriptionAndInterests(updatedInfo.speciality)) {
            return res.status(400).json({ error: 'Speciality not valid' });
        }
        if (updatedInfo.description && !validateSpecialityDescriptionAndInterests(updatedInfo.description)) {
            return res.status(400).json({ error: 'Description not valid' });
        }
        if (updatedInfo.interests && !validateSpecialityDescriptionAndInterests(updatedInfo.interests)) {
            return res.status(400).json({ error: 'Interests must be an array of valid strings' });
        }

        const updatedprofessional = await professionalModel.findByIdAndUpdate(professionalId, updatedInfo, { new: true });
        res.status(200).json(updatedprofessional);

    } catch (error) {
        next(error);
    }
};

router.post('/', authenticate, authorize(['admin']), createprofessional);
router.get('/', getprofessionals);
router.get('/filter', getprofessionalsFilter);
router.patch('/schedule/:id', authenticate, authorize(['professional']), updateprofessionalSchedule);
router.patch('/info/:id', authenticate, authorize(['professional']), updateProfessionalInfo);

export default router;