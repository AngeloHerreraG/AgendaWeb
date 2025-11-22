import mongoose from "mongoose";

// Interfaz que define la estructura del horario de un professional
export interface professionalDisponibility {
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
    schedules: string[]; // Cambiado a string[] para IDs compuestas
    role: String;
}

export interface Iprofessional extends IUser {
    speciality: string;
    description: string;
    interests?: string[];
    disponibility: professionalDisponibility;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: String, ref: 'Schedule', default: [] }], // Cambiado a String para IDs compuestas
    role: { type: String,
            enum: ['client', 'professional', 'admin'],
            required: true,
    }, 
}, {
    discriminatorKey: 'role', timestamps: true,
})

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

const UserModel = mongoose.model<IUser>('user_abbaSchedule', userSchema);

const professionalModel = UserModel.discriminator('professional', new mongoose.Schema<Iprofessional>({
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

const ClientModel = UserModel.discriminator('client', new mongoose.Schema({}));

export { UserModel, professionalModel, ClientModel };