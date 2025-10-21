"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    birthDate: { type: Date, required: true },
    schedules: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Schedule', default: [] }],
    admin: { type: Boolean, default: false },
    role: { type: String, default: 'client', required: false }
}, {
    timestamps: true,
});
const UserModel = mongoose_1.default.model('User', userSchema);
userSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        var _a;
        returnedObject.id = (_a = returnedObject._id) === null || _a === void 0 ? void 0 : _a.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // Ensure passwordHash is not returned
    },
});
exports.default = UserModel;
