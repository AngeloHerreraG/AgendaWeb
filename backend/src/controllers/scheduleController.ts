import { Request, Response, NextFunction } from 'express';
import express from "express"
import ScheduleModel from '../models/schedule';
import { ProfesionalModel, UserModel, ClientModel } from '../models/users';
import { authenticate, authorize } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const router = express.Router();

const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { scheduleBlock, status } = req.body;
        const { userId, professionalId, day, startHour, endHour } = scheduleBlock;

        const newSchedule = new ScheduleModel({
            profesionalId: new mongoose.Types.ObjectId(professionalId),
            userId: new mongoose.Types.ObjectId(userId),
            day,
            startHour,
            endHour,
            status
        });

        await newSchedule.save();

        // Linkear el schedule al profesional
        const profesional = await ProfesionalModel.findById(professionalId);
        if (profesional) {
            profesional.schedules.push(newSchedule._id);
            await profesional.save();
        }

        // Linkear el schedule al cliente
        const client = await ClientModel.findById(userId);
        if (client) {
            client.schedules.push(newSchedule._id);
            await client.save();
        }


        res.status(201).json(newSchedule);

    } catch (error) {
        next(error);
    }
};

const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schedules = await ScheduleModel.find({});
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

const getClientSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        const schedules = await ScheduleModel.find({ userId });
        res.status(200).json(schedules);

    } catch (error) {
        next(error);
    }
};

const getProfesionalSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profesionalId = req.params.id;
        const schedules = await ScheduleModel.find({ profesionalId });
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

const updateScheduleBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "blocked"];
        const { scheduleBlock, status } = req.body;
        const { userId, professionalId, day, startHour, endHour } = scheduleBlock;

        // Encontrar el schedule a partir de sus campos
        const schedule = await ScheduleModel.findOne({
            profesionalId: new mongoose.Types.ObjectId(professionalId),
            userId: new mongoose.Types.ObjectId(userId),
            day: day,
            startHour: startHour,
            endHour: endHour
        });

        console.log("Schedule encontrado: ", schedule);
        console.log("Profesional ID: ", professionalId);
        console.log("User ID: ", userId);
        console.log("Day: ", day);
        console.log("Start Hour: ", startHour);
        console.log("End Hour: ", endHour);

        // Actualizar el estado del schedule si se encuentra
        if (schedule) {
            if (!ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({ error: "Invalid status value" });
            }
            await ScheduleModel.findByIdAndUpdate(schedule._id, { status });
        }
    }
    catch (error) {
        next(error);
    }
};

router.post('/', authenticate, createSchedule);
router.patch('/', authenticate, authorize(['profesional']), updateScheduleBlock);

router.get('/', getSchedules);
router.get('/my-schedules', authenticate, authorize(['client']), getClientSchedules);
router.get('/profesional/:id', getProfesionalSchedules);

export default router;
