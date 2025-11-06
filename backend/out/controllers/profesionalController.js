"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const createProfesional = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, birthDate, speciality, description, interests, days, blocksPerHour, startHour, endHour } = req.body;
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
        const existingUser = yield users_1.ProfesionalModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
        }
        // Verify that birthDate is a valid date
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(birthDate).getFullYear();
        if (isNaN(Date.parse(birthDate)) ||
            actualYear - birthYear < 18) {
            res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }
        const textRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,;:!?()'"%\-–—/@#&+\s]{3,1000}$/;
        if (!textRegex.test(speciality) || !textRegex.test(description)) {
            res.status(400).json({ error: 'Speciality or description not valid' });
        }
        if (!Array.isArray(interests) || interests.some(interest => !textRegex.test(interest))) {
            res.status(400).json({ error: 'Interests must be an array of valid strings' });
        }
        if (!Array.isArray(days) || days.some((day) => typeof day !== 'string')) {
            res.status(400).json({ error: 'Disponibility days must be an array of strings' });
        }
        if (typeof blocksPerHour !== 'number' || typeof startHour !== 'number' || typeof endHour !== 'number') {
            res.status(400).json({ error: 'Disponibility hours must be numbers' });
        }
        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
        const newProfesional = new users_1.ProfesionalModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
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
        yield newProfesional.save();
        res.status(201).json(newProfesional);
    }
    catch (error) {
        next(error);
    }
});
const getProfesionals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesionals = yield users_1.ProfesionalModel.find({});
        res.json(profesionals);
    }
    catch (error) {
        next(error);
    }
});
const changeProfesionalDisponibility = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesionalId = req.params.id;
        const { disponibility } = req.body;
        if (profesionalId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this profesional' });
        }
        // Validate the new disponibility data
        if (disponibility) {
            const { days, blocksPerHour, startHour, endHour } = disponibility;
            if (!Array.isArray(days) || days.some((day) => typeof day !== 'string')) {
                return res.status(400).json({ error: 'Disponibility days must be an array of strings' });
            }
            if (typeof blocksPerHour !== 'number' || typeof startHour !== 'number' || typeof endHour !== 'number') {
                return res.status(400).json({ error: 'Disponibility hours must be numbers' });
            }
        }
        yield users_1.ProfesionalModel.findByIdAndUpdate(profesionalId, { disponibility }, { new: true });
        res.status(200).json({ message: 'Disponibility updated successfully' });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', createProfesional);
router.get('/', getProfesionals);
router.put('/:id/disponibility', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['profesional']), changeProfesionalDisponibility);
exports.default = router;
