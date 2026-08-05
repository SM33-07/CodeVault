import { Router } from "express";
import { aiController } from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { paramsIdSchema } from "../validation/snippet.validation";

const router = Router();

router.post(
    "/:id/explain",
    authMiddleware,
    validate(paramsIdSchema, "params"),
    aiController.explain
);

export default router;
