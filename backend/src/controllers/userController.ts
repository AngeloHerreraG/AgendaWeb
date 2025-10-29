import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/client';
import express from 'express';

const router = express.Router();

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
};

router.get("/:id", getUserById);

export default router;