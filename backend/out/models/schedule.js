"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const scheduleSchema = new mongoose_1.default.Schema({
    profesionalId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes: { type: String }
}, {
    timestamps: true,
});
const ScheduleModel = mongoose_1.default.model('Schedule', scheduleSchema);
scheduleSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        var _a;
        returnedObject.id = (_a = returnedObject._id) === null || _a === void 0 ? void 0 : _a.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = ScheduleModel;
