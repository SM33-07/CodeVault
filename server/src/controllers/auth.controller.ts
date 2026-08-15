import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { oauthService } from "../services/oauth.service";
import { env } from "../config/env";

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

    googleAuth: async (req: Request, res: Response) => {
        try {
            const url = oauthService.getGoogleAuthUrl();
            res.redirect(url);
        } catch (err: any) {
            res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    err.message || "Google OAuth is not configured."
                )}`
            );
        }
    },

    googleCallback: async (req: Request, res: Response) => {
        const code = req.query.code as string;
        const error = req.query.error as string;

        if (error || !code) {
            return res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    error || "Google authentication was cancelled."
                )}`
            );
        }

        try {
            const result = await oauthService.handleGoogleCallback(code);
            const userJson = encodeURIComponent(JSON.stringify(result.user));
            res.redirect(
                `${env.clientUrl}/auth/callback?token=${result.token}&user=${userJson}`
            );
        } catch (err: any) {
            res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    err.message || "Failed to authenticate with Google."
                )}`
            );
        }
    },

    githubAuth: async (req: Request, res: Response) => {
        try {
            const url = oauthService.getGithubAuthUrl();
            res.redirect(url);
        } catch (err: any) {
            res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    err.message || "GitHub OAuth is not configured."
                )}`
            );
        }
    },

    githubCallback: async (req: Request, res: Response) => {
        const code = req.query.code as string;
        const error = req.query.error as string;

        if (error || !code) {
            return res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    error || "GitHub authentication was cancelled."
                )}`
            );
        }

        try {
            const result = await oauthService.handleGithubCallback(code);
            const userJson = encodeURIComponent(JSON.stringify(result.user));
            res.redirect(
                `${env.clientUrl}/auth/callback?token=${result.token}&user=${userJson}`
            );
        } catch (err: any) {
            res.redirect(
                `${env.clientUrl}/login?error=${encodeURIComponent(
                    err.message || "Failed to authenticate with GitHub."
                )}`
            );
        }
    },

    oauthExchange: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { provider, code, redirectUri } = req.body;

            if (!provider || !code) {
                return res.status(400).json({ error: "Missing provider or code parameter." });
            }

            let result;
            if (provider === "google") {
                result = await oauthService.handleGoogleCallback(code, redirectUri);
            } else if (provider === "github") {
                result = await oauthService.handleGithubCallback(code, redirectUri);
            } else {
                return res.status(400).json({ error: `Unsupported OAuth provider: ${provider}` });
            }

            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message || "OAuth exchange failed." });
        }
    },
};