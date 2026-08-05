import { NextFunction, Request, Response } from "express";

import { aiService } from "../services/ai.service";
import { snippetService } from "../services/snippet.service";

export const aiController = {
    explain: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const snippet = await snippetService.findById(
                req.params.id,
                req.user?.id
            );

            const explanation = await aiService.explainSnippet(
                snippet.codeBody,
                snippet.language
            );

            res.status(200).json({
                explanation,
            });
        } catch (err) {
            next(err);
        }
    },
};