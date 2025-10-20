"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";
const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "my_secret";
const MONGODB_DBNAME = process.env.NODE_ENV === "test" ? process.env.TEST_MONGODB_DBNAME : process.env.MONGODB_DBNAME || "notesdb";
const NODE_ENV = process.env.NODE_ENV || "test";
exports.default = { PORT, MONGODB_URI, HOST, JWT_SECRET, MONGODB_DBNAME, NODE_ENV };
