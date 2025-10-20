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
const client_1 = __importDefault(require("../models/client"));
const profesional_1 = __importDefault(require("../models/profesional"));
const router = express_1.default.Router();
const createClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, birthDate } = req.body;
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
        const existingUser = yield client_1.default.findOne({ email });
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
        const newUser = new client_1.default({
            name,
            email,
            passwordHash,
            birthDate: new Date(birthDate),
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
        const users = yield client_1.default.find({}).populate('schedules', {
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
const getClientByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield client_1.default.findOne({ email }).populate('schedules', {
            profesionalId: 1,
            startDate: 1,
            finishDate: 1,
            status: 1,
            notes: 1
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
const getClientById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield client_1.default.findById(id).populate('schedules', {
            profesionalId: 1,
            startDate: 1,
            finishDate: 1,
            status: 1,
            notes: 1
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const role = req.userRole;
        let user;
        if (role === 'profesional') {
            user = yield profesional_1.default.findById(id);
        }
        else if (role === 'client') {
            user = yield client_1.default.findById(id);
        }
        else {
            return res.status(400).json({ error: 'Invalid user role' });
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', createClient);
router.get('/', getClients);
router.post('/exists', getClientByEmail);
router.get('/:id', getClientById);
exports.default = router;
