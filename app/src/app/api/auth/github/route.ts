import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const clientId = process.env.GITHUB_CLIENT_ID;

    if (!clientId) {
        return NextResponse.redirect(
            new URL("/login?error=GitHub%20OAuth%20client%20ID%20is%20not%20configured.", origin)
        );
    }

    const redirectUri = `${origin}/api/auth/github/callback`;
    const rootUrl = "https://github.com/login/oauth/authorize";

    const options = {
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "user:email",
    };

    const qs = new URLSearchParams(options);
    return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
