import { Request, Response, NextFunction } from "express";
import { snippetService } from "../services/snippet.service";
import { userService } from "../services/user.service";

export const userController = {
    getProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.getProfile(req.params.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    },

    updateProfile: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const updated = await userService.updateProfile(
                req.params.userId,
                req.user!.id,
                req.body
            );

            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    },

    getUserSnippets: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const snippets = await snippetService.findByUserId(
                req.params.userId,
                req.user?.id
            );

            res.status(200).json(snippets);
        } catch (err) {
            next(err);
        }
    },
};