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
const schedule_1 = __importDefault(require("../models/schedule"));
const users_1 = require("../models/users");
const authMiddleware_1 = require("../middleware/authMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startRaw, finishRaw, notes } = req.body;
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
        const newSchedule = new schedule_1.default({
            profesionalId: new mongoose_1.default.Types.ObjectId(profesionalId),
            startDate,
            finishDate,
            notes
        });
        yield newSchedule.save();
        // Linkear el schedule al profesional
        const profesional = yield users_1.ProfesionalModel.findById(profesionalId);
        if (profesional) {
            profesional.schedules.push(newSchedule._id);
            yield profesional.save();
        }
        res.status(201).json(newSchedule);
    }
    catch (error) {
        next(error);
    }
});
const getSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedules = yield schedule_1.default.find({});
        res.status(200).json(schedules);
    }
    catch (error) {
        next(error);
    }
});
const getClientSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const schedules = yield schedule_1.default.find({ userId });
        res.status(200).json(schedules);
    }
    catch (error) {
        next(error);
    }
});
const getProfesionalSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesionalId = req.params.id;
        const schedules = yield schedule_1.default.find({ profesionalId });
        res.status(200).json(schedules);
    }
    catch (error) {
        next(error);
    }
});
const updateScheduleStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled"];
        const { scheduleId, status } = req.body;
        const schedule = yield schedule_1.default.findById(scheduleId);
        const user = yield users_1.UserModel.findById(req.userId);
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
        yield schedule_1.default.findByIdAndUpdate(scheduleId, { status });
        // quitar schedule del usuario si se cancela
        if (status === "cancelled") {
            user.schedules = user.schedules.filter(schId => schId.toString() !== scheduleId);
            yield user.save();
        }
        else if (status === "pending" && !schedule.userId) {
            user.schedules.push(schedule._id);
            schedule.userId = user._id;
            yield user.save();
            yield schedule.save();
        }
        res.status(200).json({ message: "Schedule updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['admin', 'profesional']), createSchedule);
router.get('/', getSchedules);
router.get('/my-schedules', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['client']), getClientSchedules);
router.get('/profesionals/:id', getProfesionalSchedules);
router.put('/status', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(['client']), updateScheduleStatus);
exports.default = router;
