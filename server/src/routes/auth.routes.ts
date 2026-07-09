import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "../validation/auth.validation";

const router = Router();

router.post(
    "/signup",
    validate(signupSchema, "body"),
    authController.signup
);

router.post(
    "/login",
    validate(loginSchema, "body"),
    authController.login
);

export default router;