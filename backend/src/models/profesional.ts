import mongoose from "mongoose";

export interface IProfesional {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' };
    speciality: string;
    description: string;
    schedules: [{ type: mongoose.Types.ObjectId, ref: 'Reserve' }];
    createdAt: Date;
    updatedAt: Date;
}

const profesionalSchema = new mongoose.Schema<IProfesional>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserve' }]
}, {
    timestamps: true
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