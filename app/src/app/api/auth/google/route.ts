import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return NextResponse.redirect(
            new URL("/login?error=Google%20OAuth%20client%20ID%20is%20not%20configured.", origin)
        );
    }

    const redirectUri = `${origin}/api/auth/google/callback`;
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri: redirectUri,
        client_id: clientId,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
