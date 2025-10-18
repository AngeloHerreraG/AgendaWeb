import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import config from "./utils/config";

const app = express();

mongoose.set("strictQuery", false);
if (config.MONGODB_URI) {
    mongoose.connect(config.MONGODB_URI, {dbName: config.MONGODB_DBNAME})
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error.message);
        });
}

export default app;