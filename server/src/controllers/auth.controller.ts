import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { ConflictError } from "../errors/index";
export const authController = {
    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.signup(
                req.body.email,
                req.body.password
            );

            res.status(201).json(result);
        } catch (err: any) {
            next(err);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(
                req.body.email,
                req.body.password
            );

            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    },
};