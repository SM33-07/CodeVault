import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

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
                const response = await fetch(`${backendUrl!.replace(/\/+$/, "")}/api/users/${id}/snippets`);
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: response.status });
                }
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
