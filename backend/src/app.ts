import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import config from "./utils/config";
import { seedAdmin } from "./utils/seedAdmin";
import clientRouter from "./controllers/clientController";
import loginRouter from "./controllers/login";
import professionalRouter from "./controllers/professionalController";
import scheduleRouter from "./controllers/scheduleController";
import userRouter from "./controllers/userController";
import testingRouter from "./controllers/testingController";
import path from "path";

const app = express();

mongoose.set("strictQuery", false);
if (config.MONGODB_URI) {
    mongoose.connect(config.MONGODB_URI, {dbName: config.MONGODB_DBNAME})
        .then(() => {
            seedAdmin();
        })
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
app.use("/api/testing", testingRouter);

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app;