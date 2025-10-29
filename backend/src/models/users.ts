import mongoose from "mongoose";

// Interfaz que define la estructura del horario de un profesional
export interface ProfesionalDisponibility {
    days: string[];
    blocksPerHour: number;
    startHour: number;
    endHour: number;
}

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    birthDate: Date;
    schedules: mongoose.Types.ObjectId[];
    role: String;
}

export interface IProfesional extends IUser {
    speciality: string;
    description: string;
    interests?: string[];
    disponibility?: ProfesionalDisponibility;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    role: { type: String,
            enum: ['client', 'profesional', 'admin'],
            required: true,
    }, 
}, {
    discriminatorKey: 'role', timestamps: true,
})

const UserModel = mongoose.model<IUser>('User', userSchema);

const ProfesionalModel = UserModel.discriminator('profesional', new mongoose.Schema<IProfesional>({
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    interests: [{ type: String, required: false }],
    disponibility: {
        days: [{ type: String }],
        blocksPerHour: { type: Number },
        startHour: { type: Number },
        endHour: { type: Number }
    },
}));



userSchema.set("toJSON", {
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

export { UserModel, ProfesionalModel }