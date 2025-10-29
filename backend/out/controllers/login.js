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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const users_1 = require("../models/users");
const config_1 = __importDefault(require("../utils/config"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield users_1.UserModel.findOne({ email });
    if (user) {
        const passwordCorrect = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            res.status(401).json({
                error: "invalid username or password",
            });
        }
        else {
            const userForToken = {
                email: user.email,
                csrf: crypto.randomUUID(),
                id: user._id,
                role: user.role,
            };
            const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.JWT_SECRET, {
                expiresIn: 60 * 60,
            });
            res.setHeader("X-CSRF-Token", userForToken.csrf);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
            res.status(200).send({
                id: user._id,
                name: user.name,
                email: user.email,
                birthDate: user.birthDate,
                schedule: user.schedules,
                role: user.role
            });
        }
    }
    else {
        res.status(401).json({
            error: "invalid email or password",
        });
    }
});
const getLoggedInUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield users_1.UserModel.findById(userId);
    res.status(200).send(user);
});
const logout = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).send({
        message: "Logged out successfully"
    });
};
router.post("/", login);
router.get("/me", authMiddleware_1.authenticate, getLoggedInUser);
router.post("/logout", logout);
exports.default = router;
