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

        // Serverless Profile Fallback
        return NextResponse.json({
            id,
            displayName: "Soham More",
            email: "developer@codevault.dev",
            bio: "Full-stack engineer building high-performance developer tools, snippet managers, and distributed systems.",
            createdAt: "Joined July 2026",
            stats: {
                snippetsCount: 12,
                totalViews: 3420,
                forksCount: 8,
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
