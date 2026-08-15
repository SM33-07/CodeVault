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

// Google OAuth
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);

// GitHub OAuth
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubCallback);

// Programmatic OAuth Exchange (for Next.js App Router / serverless clients)
router.post("/oauth-exchange", authController.oauthExchange);

export default router;