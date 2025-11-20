import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const MONGODB_DBNAME = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_DBNAME || "AgendaWeb_test"
    : process.env.MONGODB_DBNAME || "AgendaWeb";

const config = {
    MONGODB_URI,
    MONGODB_DBNAME,
    JWT_SECRET: process.env.JWT_SECRET || "default-secret",
    PORT: process.env.PORT || 3001,
    HOST: process.env.HOST || "localhost"
};

export default config;