import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../utils/config';


export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req;
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: "token missing" });
        } else {
            const decodedToken = jwt.verify(token, config.JWT_SECRET);
            const csrfToken = req.headers["x-csrf-token"];
            if (
                typeof decodedToken === "object" &&
                decodedToken.id &&
                decodedToken.csrf == csrfToken
            ) {
                authReq.userId = decodedToken.id;
                authReq.userRole = decodedToken.role;
                next();
            } else {
                res.status(401).json({ error: "invalid token" });
            }
        }
    } catch (error) {
        res.status(401).json({ error: "invalid token" });
    }
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const authReq = req;
    const userRole = authReq.userRole;
    if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: insufficient privileges" });
    }
    next();
};
