import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

        if (backendUrl && !backendUrl.includes("localhost")) {
            try {
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/users/${id}/snippets`);
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } catch (err) {
                console.warn("External backend unreachable for user snippets:", err);
            }
        }

        return NextResponse.json(SAMPLE_SNIPPETS);
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to fetch user snippets" },
            { status: 500 }
        );
    }
}
