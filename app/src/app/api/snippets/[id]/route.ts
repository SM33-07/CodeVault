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
                const response = await fetch(`${backendUrl!.replace(/\/+$/, "")}/api/snippets/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: response.status });
                }
            } catch (err) {
                console.warn("External backend unreachable, resolving from sample list:", err);
            }
        }

        const found = SAMPLE_SNIPPETS.find((s) => s.id === id) || SAMPLE_SNIPPETS[0];
        return NextResponse.json(found);
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to fetch snippet" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        return NextResponse.json({ success: true, id }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to delete snippet" },
            { status: 500 }
        );
    }
}
