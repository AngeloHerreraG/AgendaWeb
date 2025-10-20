import { Request, Response, NextFunction } from 'express';
import express from "express"
import ScheduleModel from '../models/schedule';
import ClientModel from '../models/client';
import { authenticate, authorize } from '../middleware/authMiddleware';
import mongoose from 'mongoose';
import UserModel from '../models/client';

const router = express.Router();

const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {startRaw, finishRaw, notes } = req.body;
        const profesionalId = req.userId;

        // Validar dates
        const startDate = new Date(startRaw);
        const finishDate = new Date(finishRaw);
        if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
            return res.status(400).json({ error: "startDate y finishDate deben ser fechas válidas" });
        }
        if (startDate >= finishDate) {
            return res.status(400).json({ error: "startDate debe ser anterior a finishDate" });
        }

        const newSchedule = new ScheduleModel({
            profesionalId: new mongoose.Types.ObjectId(profesionalId),
            startDate,
            finishDate,
            notes
        });

        await newSchedule.save();
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

const updateScheduleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled"];
        const { scheduleId, status } = req.body;

        const schedule = await ScheduleModel.findById(scheduleId);
        const user = await ClientModel.findById(req.userId);

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        if (schedule.userId && schedule.userId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized to update this schedule" });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // actualizar estado del schedule
        await ScheduleModel.findByIdAndUpdate(scheduleId, { status });

        // quitar schedule del usuario si se cancela
        if (status === "cancelled") {
            user.schedules = user.schedules.filter(schId => schId.toString() !== scheduleId);
            await user.save();
        }

        else if (status === "pending" && !schedule.userId) {
            user.schedules.push(schedule._id);
            schedule.userId = user._id;
            await user.save();
            await schedule.save();
        }

        res.status(200).json({ message: "Schedule updated successfully" });
    }
    catch (error) {
        next(error);
    }
};

router.post('/', authenticate, authorize(['admin', 'profesional']), createSchedule);
router.get('/', getSchedules);
router.get('/my-schedules', authenticate, authorize(['client']), getClientSchedules);
router.get('/profesionals/:id', getProfesionalSchedules);
router.put('/status', authenticate, authorize(['client']), updateScheduleStatus);

export default router;
