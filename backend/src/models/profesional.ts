import mongoose from "mongoose";
import { IUser } from "./client";

export interface IProfesional extends IUser {
    speciality: string;
    description: string;
    interests?: string[];
}

const profesionalSchema = new mongoose.Schema<IProfesional>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    role: { type: String, enum: ['client', 'profesional', 'admin'], default: 'profesional' },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    interests: [{ type: String }]
}, {
    timestamps: true,
});

const ProfesionalModel = mongoose.model<IProfesional>('Profesional', profesionalSchema);

profesionalSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number; }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default ProfesionalModel;