import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import Client from "../models/client";
import Profesional from "../models/profesional";
import config from "../utils/config";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", async (request, response) => {
    const { email, password, role } = request.body;

    if (role !== "client" && role !== "profesional" && role !== "admin") {
        return response.status(400).json({ error: "Invalid role specified" });
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
            response.status(401).json({
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
            response.setHeader("X-CSRF-Token", userForToken.csrf);
            response.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });
            response.status(200).send({ email: user.email, name: user.name });
        }
    } else {
        response.status(401).json({
            error: "invalid email or password",
        });
    }
});

router.get("/me", authenticate, async (request, response, next) => {
    const role = request.userRole;
    let user;
    if (role === "client") {
        user = await Client.findById(request.userId);
    } else if (role === "profesional") {
        user = await Profesional.findById(request.userId);
    }
    response.status(200).send(user);
});

router.post("/logout", (request, response) => {
    response.clearCookie("token");
    response.status(200).send({
        message: "Logged out successfully"
    });
});

export default router;