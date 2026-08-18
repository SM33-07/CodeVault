import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return NextResponse.redirect(
            new URL(
                `/login?error=${encodeURIComponent(error || "Google authentication was cancelled.")}`,
                origin
            )
        );
    }

    const redirectUri = `${origin}/api/auth/google/callback`;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // 1. Try external backend if configured and live
    if (backendUrl && !backendUrl.includes("localhost")) {
        try {
            const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/auth/oauth-exchange`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: "google", code, redirectUri }),
            });

            if (response.ok) {
                const data = await response.json();
                const userJson = encodeURIComponent(JSON.stringify(data.user));
                return NextResponse.redirect(
                    new URL(`/auth/callback?token=${data.token}&user=${userJson}`, origin)
                );
            }
        } catch (backendErr) {
            console.warn("External backend unreachable for Google OAuth, attempting direct exchange:", backendErr);
        }
    }

    // 2. Direct Serverless Google OAuth token exchange
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Google OAuth credentials (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET) missing on server.");
        }

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            throw new Error(`Google token exchange failed: ${errorText}`);
        }

        const tokenData = await tokenRes.json();

        // Fetch User Info from Google
        const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userRes.ok) {
            throw new Error("Failed to fetch Google user profile.");
        }

        const googleUser = await userRes.json();

        const user = {
            id: `g_${googleUser.sub}`,
            email: googleUser.email,
            displayName: googleUser.name || googleUser.email.split("@")[0],
            avatarUrl: googleUser.picture,
            bio: "Developer & CodeVault snippet curator.",
        };

        const sessionToken = "cv_g_" + Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString("base64url");
        const userJson = encodeURIComponent(JSON.stringify(user));

        return NextResponse.redirect(
            new URL(`/auth/callback?token=${sessionToken}&user=${userJson}`, origin)
        );
    } catch (err: any) {
        return NextResponse.redirect(
            new URL(
                `/login?error=${encodeURIComponent(err.message || "Failed to complete Google authentication.")}`,
                origin
            )
        );
    }
}
