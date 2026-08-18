import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export async function GET(request: NextRequest) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

        if (backendUrl && !backendUrl.includes("localhost")) {
            try {
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/snippets`);
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } catch (err) {
                console.warn("External backend unreachable, serving sample snippets:", err);
            }
        }

        return NextResponse.json(SAMPLE_SNIPPETS);
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to fetch snippets" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

        if (backendUrl && !backendUrl.includes("localhost")) {
            try {
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/snippets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                return NextResponse.json(data, { status: response.status });
            } catch (err) {
                console.warn("External backend unreachable, creating local snippet:", err);
            }
        }

        const newSnippet = {
            id: `snip-${Date.now()}`,
            ...body,
            createdAt: new Date().toISOString(),
            viewCount: 0,
            forkCount: 0,
        };

        return NextResponse.json(newSnippet, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to create snippet" },
            { status: 500 }
        );
    }
}
