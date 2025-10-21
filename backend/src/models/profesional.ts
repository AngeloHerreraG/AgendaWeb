import mongoose from "mongoose";
import { IUser } from "./client";

// Interfaz que define la estructura del horario de un profesional
export interface ProfesionalDisponibility {
    days: string[];
    blocksPerHour: number;
    startHour: number;
    endHour: number;
}

export interface IProfesional extends IUser {
    speciality: string;
    description: string;
    interests?: string[];
    disponibility?: ProfesionalDisponibility;
}

const profesionalSchema = new mongoose.Schema<IProfesional>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    admin: { type: Boolean, default: false },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    interests: [{ type: String, required: false }],
    role: { type: String, default: 'profesional', required: false},
    disponibility: {
        days: [{ type: String }],
        blocksPerHour: { type: Number },
        startHour: { type: Number },
        endHour: { type: Number }
    },
}, {
    timestamps: true,
});

const ProfesionalModel = mongoose.model<IProfesional>('Profesional', profesionalSchema);

profesionalSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number; passwordHash?: string }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Ensure passwordHash is not returned
  },
});

export default ProfesionalModel;