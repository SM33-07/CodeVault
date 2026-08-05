import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updatedProfileSchema } from "../validation/user.validation";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { userParamsSchema } from "../validation/user.validation";

const router = Router();

router.get("/:userId", optionalAuth, validate(userParamsSchema, "params"), userController.getProfile);

router.put(
    "/:userId",
    authMiddleware,
    validate(userParamsSchema, "params"),
    validate(updatedProfileSchema, "body"),
    userController.updateProfile
);

router.get("/:userId/snippets", optionalAuth, validate(userParamsSchema, "params"), userController.getUserSnippets);

export default router;