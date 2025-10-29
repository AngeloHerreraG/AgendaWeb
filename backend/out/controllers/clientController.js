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
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
const router = express_1.default.Router();
const createClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield users_1.UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
        }
        // Verify that birthDate is a valid date
        const actualYear = new Date().getFullYear();
        const birthYear = new Date(birthDate).getFullYear();
        if (isNaN(Date.parse(birthDate)) ||
            actualYear - birthYear < 12) {
            res.status(400).json({ error: 'Invalid birth date format or age restriction not satisfied' });
        }
        // Hash the password before saving
        const saltRounds = 11;
        const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = new users_1.UserModel({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
            role: "client"
        });
        yield newUser.save();
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
});
const getClients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.UserModel.find({ role: "client" }).populate('schedules', {
            profesionalId: 1,
            startDate: 1,
            finishDate: 1,
            status: 1,
            notes: 1
        });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', createClient);
router.get('/', getClients);
exports.default = router;
