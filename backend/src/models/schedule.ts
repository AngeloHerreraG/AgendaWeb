import mongoose from "mongoose";

export interface ISchedule {
    profesionalId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | null;
    day: string;
    startHour: string;
    endHour: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'blocked';
    createdAt: Date;
    updatedAt: Date;
}

const scheduleSchema = new mongoose.Schema<ISchedule>({
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    day: { type: String, required: true },
    startHour: { type: String, required: true },
    endHour: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'blocked'], default: 'pending', required: true },
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
