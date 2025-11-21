import mongoose from "mongoose";

export type BlockStatus = 'pendiente' | 'confirmado' | 'cancelado' | 'bloqueado';

export interface ISchedule {
    _id: string; // ID compuesta personalizada
    professionalId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | null;
    day: string;
    startHour: string;
    endHour: string;
    status: BlockStatus;
    createdAt: Date;
    updatedAt: Date;
}

const scheduleSchema = new mongoose.Schema<ISchedule>({
    _id: { type: String, required: true }, // ID compuesta como string
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'professional', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    day: { type: String, required: true },
    startHour: { type: String, required: true },
    endHour: { type: String, required: true },
    status: { type: String, enum: ['pendiente', 'confirmado', 'cancelado', 'bloqueado'], default: 'pendiente', required: true },
}, {
    timestamps: true,
    _id: false // Deshabilita la generación automática de _id
});

// Índice único compuesto para evitar duplicados
scheduleSchema.index({ professionalId: 1, day: 1, startHour: 1, endHour: 1 }, { unique: true });

const ScheduleModel = mongoose.model<ISchedule>('Schedule', scheduleSchema);

scheduleSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: string; __v?: number; }
  ) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default ScheduleModel;
