import { NextRequest, NextResponse } from "next/server";

function shouldProxyToBackend(url?: string): boolean {
    if (!url) return false;
    const trimmed = url.trim().toLowerCase();
    return !(
        trimmed.includes("localhost") ||
        trimmed.includes("127.0.0.1") ||
        trimmed.includes("vercel.app") ||
        trimmed.includes("trycodevault")
    );
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const backendUrl = process.env.BACKEND_URL;

        if (shouldProxyToBackend(backendUrl)) {
            try {
                const response = await fetch(`${backendUrl!.replace(/\/+$/, "")}/api/users/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: response.status });
                }
            } catch (err) {
                console.warn("External backend unreachable for user profile:", err);
            }
        }

        // Serverless Profile Generation
        return NextResponse.json({
            id,
            displayName: id === "me" ? "Developer" : id,
            email: "developer@codevault.dev",
            bio: "CodeVault developer & snippet curator.",
            createdAt: "Active Member",
            followersCount: 0,
            followingCount: 0,
            stats: {
                snippetsCount: 0,
                totalViews: 0,
                forksCount: 0,
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to fetch user profile" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        return NextResponse.json({
            id,
            ...body,
            updatedAt: new Date().toISOString(),
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
