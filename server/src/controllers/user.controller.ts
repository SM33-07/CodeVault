import { Request, Response, NextFunction } from "express";
import { snippetService } from "../services/snippet.service";
import { userService } from "../services/user.service";

export const userController = {
    getProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const targetId = req.params.userId === "me" ? req.user?.id : req.params.userId;
            if (!targetId) {
                return res.status(401).json({ error: "Authentication required for 'me' profile" });
            }
            const user = await userService.getProfile(targetId);
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
            const targetId = req.params.userId === "me" ? req.user!.id : req.params.userId;
            const updated = await userService.updateProfile(
                targetId,
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
            const targetId = req.params.userId === "me" ? req.user?.id : req.params.userId;
            if (!targetId) {
                return res.status(200).json([]);
            }
            const snippets = await snippetService.findByUserId(
                targetId,
                req.user?.id
            );

            res.status(200).json(snippets);
        } catch (err) {
            next(err);
        }
    },
};