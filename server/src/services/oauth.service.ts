import jwt from "jsonwebtoken";
import { env } from "../config/env";
import * as userRepository from "../repositories/user.repository";

export const oauthService = {
    // -------------------------------------------------------------
    // Google OAuth
    // -------------------------------------------------------------
    getGoogleAuthUrl(): string {
        if (!env.googleClientId) {
            throw new Error("Google OAuth client ID is not configured.");
        }

        const redirectUri = `${env.serverUrl}/api/auth/google/callback`;
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

        const options = {
            redirect_uri: redirectUri,
            client_id: env.googleClientId,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" "),
        };

        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    },

    async handleGoogleCallback(code: string) {
        if (!env.googleClientId || !env.googleClientSecret) {
            throw new Error("Google OAuth credentials are not configured.");
        }

        const redirectUri = `${env.serverUrl}/api/auth/google/callback`;
        const tokenUrl = "https://oauth2.googleapis.com/token";

        // 1. Exchange authorization code for access token
        const tokenRes = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: env.googleClientId,
                client_secret: env.googleClientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            throw new Error(`Google token exchange failed: ${errorText}`);
        }

        const tokenData = (await tokenRes.json()) as { access_token: string; id_token: string };

        // 2. Fetch User Profile from Google
        const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userRes.ok) {
            throw new Error("Failed to fetch Google user profile.");
        }

        const googleUser = (await userRes.json()) as {
            sub: string;
            email: string;
            name?: string;
            picture?: string;
        };

        if (!googleUser.email) {
            throw new Error("No verified email returned from Google.");
        }

        // 3. Upsert user in database
        const user = await userRepository.upsertOAuthUser({
            email: googleUser.email.toLowerCase(),
            displayName: googleUser.name || googleUser.email.split("@")[0],
            avatarUrl: googleUser.picture,
            provider: "google",
            providerId: googleUser.sub,
        });

        // 4. Sign CodeVault JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn,
            }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
            },
        };
    },

    // -------------------------------------------------------------
    // GitHub OAuth
    // -------------------------------------------------------------
    getGithubAuthUrl(): string {
        if (!env.githubClientId) {
            throw new Error("GitHub OAuth client ID is not configured.");
        }

        const redirectUri = `${env.serverUrl}/api/auth/github/callback`;
        const rootUrl = "https://github.com/login/oauth/authorize";

        const options = {
            client_id: env.githubClientId,
            redirect_uri: redirectUri,
            scope: "user:email",
        };

        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    },

    async handleGithubCallback(code: string) {
        if (!env.githubClientId || !env.githubClientSecret) {
            throw new Error("GitHub OAuth credentials are not configured.");
        }

        const redirectUri = `${env.serverUrl}/api/auth/github/callback`;
        const tokenUrl = "https://github.com/login/oauth/access_token";

        // 1. Exchange authorization code for access token
        const tokenRes = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: env.githubClientId,
                client_secret: env.githubClientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            throw new Error(`GitHub token exchange failed: ${errorText}`);
        }

        const tokenData = (await tokenRes.json()) as {
            access_token?: string;
            error?: string;
            error_description?: string;
        };

        if (!tokenData.access_token) {
            throw new Error(
                tokenData.error_description || tokenData.error || "Failed to obtain GitHub access token."
            );
        }

        // 2. Fetch User Profile
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "User-Agent": "CodeVault-App",
            },
        });

        if (!userRes.ok) {
            throw new Error("Failed to fetch GitHub user profile.");
        }

        const githubUser = (await userRes.json()) as {
            id: number;
            login: string;
            name?: string;
            email?: string;
            avatar_url?: string;
            bio?: string;
        };

        // 3. Ensure we have primary verified email
        let email = githubUser.email;
        if (!email) {
            const emailsRes = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "User-Agent": "CodeVault-App",
                },
            });

            if (emailsRes.ok) {
                const emails = (await emailsRes.json()) as Array<{
                    email: string;
                    primary: boolean;
                    verified: boolean;
                }>;
                const primary = emails.find((e) => e.primary && e.verified) || emails[0];
                if (primary) {
                    email = primary.email;
                }
            }
        }

        if (!email) {
            email = `${githubUser.login}@users.noreply.github.com`;
        }

        // 4. Upsert user in database
        const user = await userRepository.upsertOAuthUser({
            email: email.toLowerCase(),
            displayName: githubUser.name || githubUser.login,
            avatarUrl: githubUser.avatar_url,
            provider: "github",
            providerId: String(githubUser.id),
        });

        // 5. Sign CodeVault JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiresIn,
            }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
            },
        };
    },
};
