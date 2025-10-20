import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';
import express from "express";
import Client from "../models/client";
import Profesional from "../models/profesional";
import config from "../utils/config";
import { authenticate } from "../middleware/authMiddleware";


const router = express.Router();

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;

    if (role !== "client" && role !== "profesional" && role !== "admin") {
        return res.status(400).json({ error: "Invalid role specified" });
    }

    let user;
    if (role === "client") {
        user = await Client.findOne({ email });
    } else if (role === "profesional") {
        user = await Profesional.findOne({ email });
    }

    if (user) {
        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!passwordCorrect) {
            res.status(401).json({
                error: "invalid username or password",
            });
        } else {
            const userForToken = {
                email: user.email,
                csrf: crypto.randomUUID(),
                id: user._id,
                role: role,
            };

            const token = jwt.sign(userForToken, config.JWT_SECRET, {
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
                role: role
            });
        }
    } else {
        res.status(401).json({
            error: "invalid email or password",
        });
    }
};

const getLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const role = req.userRole;

    let user;

    if (!userId || !role) {
        user = null;
    }

    else if (role === "client") {
        user = await Client.findById(userId);
    } else if (role === "profesional") {
        user = await Profesional.findById(userId);
    }

    res.status(200).send(user);
};

const logout = (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token");
    res.status(200).send({
        message: "Logged out successfully"
    });
};

router.post("/", login);
router.get("/me", authenticate, getLoggedInUser);
router.post("/logout", logout);

export default router;