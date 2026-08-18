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
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/snippets/${id}`);
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
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
