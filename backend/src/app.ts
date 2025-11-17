import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import config from "./utils/config";
import clientRouter from "./controllers/clientController";
import loginRouter from "./controllers/login";
import professionalRouter from "./controllers/professionalController";
import scheduleRouter from "./controllers/scheduleController";
import userRouter from "./controllers/userController";

const app = express();

mongoose.set("strictQuery", false);
if (config.MONGODB_URI) {
    mongoose.connect(config.MONGODB_URI, {dbName: config.MONGODB_DBNAME})
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error.message);
        });
}

app.use(express.static("dist"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/clients", clientRouter);
app.use("/api/login", loginRouter);
app.use("/api/professionals", professionalRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/users", userRouter);

export default app;