"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profesionalSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    admin: { type: Boolean, default: false },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    interests: [{ type: String, required: false }],
    role: { type: String, default: 'profesional', required: false },
    disponibility: {
        days: [{ type: String }],
        blocksPerHour: { type: Number },
        startHour: { type: Number },
        endHour: { type: Number }
    },
}, {
    timestamps: true,
});
const ProfesionalModel = mongoose_1.default.model('Profesional', profesionalSchema);
profesionalSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        var _a;
        returnedObject.id = (_a = returnedObject._id) === null || _a === void 0 ? void 0 : _a.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // Ensure passwordHash is not returned
    },
});
// ESTO SE DEBE EJECUTAR SOLO LA PRIMERA VEZ PARA AGREGAR PROFESIONALES A LA BASE DE DATOS AUTOMATICAMENTE.
// LUEGO, COMENTAR DESDE LA LINEA 58 A LA 61 PARA NO AGREGAR DUPLICADOS.
// initialProfesionals.forEach(profesional => {
//     const newProfesional = new ProfesionalModel(profesional);
//     newProfesional.save();
// });
exports.default = ProfesionalModel;
