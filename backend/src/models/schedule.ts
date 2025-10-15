import mongoose from "mongoose";

export interface ISchedule {
    profesionalId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    startDate: Date;
    finishDate: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | null;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
}

const scheduleSchema = new mongoose.Schema<ISchedule>({
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes: { type: String }
}, {
    timestamps: true,
});

const ScheduleModel = mongoose.model<ISchedule>('Schedule', scheduleSchema);

scheduleSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number; }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default ScheduleModel;
