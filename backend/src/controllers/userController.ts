import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/users';
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

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(404).json({ message: 'User already exists' });
        }
        res.status(200).json({ message: 'Email is available' });
    } catch (error) {
        next(error);
    }
};

router.get("/:id", getUserById);
router.post("/exists", getUserByEmail);

export default router;