"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authReq = req;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            authReq.userId = undefined;
            authReq.userRole = undefined;
            next();
        }
        else {
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            const csrfToken = req.headers["x-csrf-token"];
            if (typeof decodedToken === "object" &&
                decodedToken.id &&
                decodedToken.csrf == csrfToken) {
                authReq.userId = decodedToken.id;
                authReq.userRole = decodedToken.role;
                next();
            }
            else {
                res.status(401).json({ error: "invalid token" });
            }
        }
    }
    catch (error) {
        res.status(401).json({ error: "invalid token" });
    }
});
exports.authenticate = authenticate;
const authorize = (roles) => (req, res, next) => {
    const authReq = req;
    const userRole = authReq.userRole;
    if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: insufficient privileges" });
    }
    next();
};
exports.authorize = authorize;
