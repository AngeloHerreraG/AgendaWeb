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
const client_1 = __importDefault(require("../models/client"));
const profesional_1 = __importDefault(require("../models/profesional"));
const config_1 = __importDefault(require("../utils/config"));
const router = express_1.default.Router();
router.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = request.body;
    if (role !== "client" && role !== "profesional" && role !== "admin") {
        return response.status(400).json({ error: "Invalid role specified" });
    }
    let user;
    if (role === "client") {
        user = yield client_1.default.findOne({ email });
    }
    else if (role === "profesional") {
        user = yield profesional_1.default.findOne({ email });
    }
    if (user) {
        const passwordCorrect = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            response.status(401).json({
                error: "invalid username or password",
            });
        }
        else {
            const userForToken = {
                email: user.email,
                csrf: crypto.randomUUID(),
                id: user._id,
                role: role,
            };
            const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.JWT_SECRET, {
                expiresIn: 60 * 60,
            });
            response.setHeader("X-CSRF-Token", userForToken.csrf);
            response.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
            response.status(200).send({
                id: user._id,
                name: user.name,
                email: user.email,
                birthDate: user.birthDate,
                schedule: user.schedules,
                role: role
            });
        }
    }
    else {
        response.status(401).json({
            error: "invalid email or password",
        });
    }
}));
router.get("/me", (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const role = request.userRole;
    let user;
    if (role === "client") {
        user = yield client_1.default.findById(request.userId);
    }
    else if (role === "profesional") {
        user = yield profesional_1.default.findById(request.userId);
    }
    response.status(200).send(user);
}));
router.post("/logout", (request, response) => {
    response.clearCookie("token");
    response.status(200).send({
        message: "Logged out successfully"
    });
});
exports.default = router;
