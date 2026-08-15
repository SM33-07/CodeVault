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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

    try {
        const response = await fetch(`${backendUrl}/api/auth/oauth-exchange`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider: "github",
                code,
                redirectUri,
            }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({ error: "OAuth exchange failed" }));
            return NextResponse.redirect(
                new URL(
                    `/login?error=${encodeURIComponent(errData.error || "Authentication failed.")}`,
                    origin
                )
            );
        }

        const data = await response.json();
        const userJson = encodeURIComponent(JSON.stringify(data.user));

        return NextResponse.redirect(
            new URL(`/auth/callback?token=${data.token}&user=${userJson}`, origin)
        );
    } catch (err: any) {
        return NextResponse.redirect(
            new URL(
                `/login?error=${encodeURIComponent(err.message || "Failed to reach authentication server.")}`,
                origin
            )
        );
    }
}
