import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

        if (backendUrl && !backendUrl.includes("localhost")) {
            try {
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/users/${id}`);
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
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
