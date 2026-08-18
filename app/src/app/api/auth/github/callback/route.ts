import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return NextResponse.redirect(
            new URL(
                `/login?error=${encodeURIComponent(error || "GitHub authentication was cancelled.")}`,
                origin
            )
        );
    }

    const redirectUri = `${origin}/api/auth/github/callback`;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // 1. Try external backend if configured and live
    if (backendUrl && !backendUrl.includes("localhost")) {
        try {
            const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/auth/oauth-exchange`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: "github", code, redirectUri }),
            });

            if (response.ok) {
                const data = await response.json();
                const userJson = encodeURIComponent(JSON.stringify(data.user));
                return NextResponse.redirect(
                    new URL(`/auth/callback?token=${data.token}&user=${userJson}`, origin)
                );
            }
        } catch (backendErr) {
            console.warn("External backend unreachable for GitHub OAuth, attempting direct exchange:", backendErr);
        }
    }

    // 2. Direct Serverless GitHub OAuth token exchange
    try {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("GitHub OAuth credentials (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET) missing on server.");
        }

        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            throw new Error(`GitHub token exchange failed: ${errorText}`);
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error(tokenData.error_description || tokenData.error || "Failed to obtain GitHub access token.");
        }

        // Fetch User Info from GitHub
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "CodeVault-App",
            },
        });

        if (!userRes.ok) {
            throw new Error("Failed to fetch GitHub user profile.");
        }

        const githubUser = await userRes.json();

        // Get email if private
        let email = githubUser.email;
        if (!email) {
            try {
                const emailsRes = await fetch("https://api.github.com/user/emails", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "User-Agent": "CodeVault-App",
                    },
                });
                if (emailsRes.ok) {
                    const emails = await emailsRes.json();
                    const primary = emails.find((e: any) => e.primary && e.verified);
                    if (primary) email = primary.email;
                }
            } catch {
                // fallback
            }
        }

        if (!email) {
            email = `${githubUser.login}@users.noreply.github.com`;
        }

        const user = {
            id: `gh_${githubUser.id}`,
            email,
            displayName: githubUser.name || githubUser.login,
            avatarUrl: githubUser.avatar_url,
            bio: githubUser.bio || "GitHub Developer",
        };

        const sessionToken = "cv_gh_" + Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString("base64url");
        const userJson = encodeURIComponent(JSON.stringify(user));

        return NextResponse.redirect(
            new URL(`/auth/callback?token=${sessionToken}&user=${userJson}`, origin)
        );
    } catch (err: any) {
        return NextResponse.redirect(
            new URL(
                `/login?error=${encodeURIComponent(err.message || "Failed to complete GitHub authentication.")}`,
                origin
            )
        );
    }
}
