import mongoose from "mongoose";

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    birthDate: Date;
    schedules: mongoose.Types.ObjectId[];
    admin?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    admin: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const UserModel = mongoose.model<IUser>('User', userSchema);

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

export default UserModel;