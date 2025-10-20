"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./utils/config"));
const clientController_1 = __importDefault(require("./controllers/clientController"));
const login_1 = __importDefault(require("./controllers/login"));
const profesionalController_1 = __importDefault(require("./controllers/profesionalController"));
const scheduleController_1 = __importDefault(require("./controllers/scheduleController"));
const app = (0, express_1.default)();
mongoose_1.default.set("strictQuery", false);
if (config_1.default.MONGODB_URI) {
    mongoose_1.default.connect(config_1.default.MONGODB_URI, { dbName: config_1.default.MONGODB_DBNAME })
        .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });
}
app.use(express_1.default.static("dist"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/clients", clientController_1.default);
app.use("/api/login", login_1.default);
app.use("/api/profesionals", profesionalController_1.default);
app.use("/api/schedules", scheduleController_1.default);
exports.default = app;
