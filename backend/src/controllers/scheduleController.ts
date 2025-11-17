import { Request, Response, NextFunction } from 'express';
import express from "express"
import ScheduleModel from '../models/schedule';
import { ProfesionalModel, UserModel, ClientModel } from '../models/users';
import { authenticate, authorize } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

const router = express.Router();


const getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scheduleId = req.params.id;
        const schedule = await ScheduleModel.findById(scheduleId);
        res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
};

const getProfesionalSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profesionalId = req.params.id;
        const schedules = await ScheduleModel.find({ profesionalId });
        res.status(200).json(schedules);
    } catch (error) {
        next(error);
    }
};

const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { scheduleBlock, status } = req.body;
        const { id, userId, professionalId, day, startHour, endHour } = scheduleBlock;

        const newSchedule = new ScheduleModel({
            _id: id,
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

const updateScheduleBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "blocked"];
        const { scheduleBlock, status } = req.body;
        const { id, userId, professionalId, day, startHour, endHour } = scheduleBlock;

        const schedule = await ScheduleModel.findById(id);

        // Actualizar el estado del schedule si se encuentra
        if (schedule) {
            if (!ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({ error: "Invalid status value" });
            }
            await ScheduleModel.findByIdAndUpdate(schedule._id, { status });
            res.status(200).json({ message: "Schedule updated successfully" });
        }
        else {
            res.status(404).json({ error: "Schedule not found" });
        }
    }
    catch (error) {
        next(error);
    }
};

router.get('/:id', getSchedule);
router.get('/profesional/:id', getProfesionalSchedule);
router.post('/', authenticate, createSchedule);
router.patch('/:id', authenticate, updateScheduleBlock);

export default router;