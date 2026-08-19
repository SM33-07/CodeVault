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

export async function GET(request: NextRequest) {
    try {
        const backendUrl = process.env.BACKEND_URL;

        if (shouldProxyToBackend(backendUrl)) {
            try {
                const response = await fetch(`${backendUrl!.replace(/\/+$/, "")}/api/snippets`);
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: response.status });
                }
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
        const backendUrl = process.env.BACKEND_URL;

        if (shouldProxyToBackend(backendUrl)) {
            try {
                const response = await fetch(`${backendUrl!.replace(/\/+$/, "")}/api/snippets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: response.status });
                }
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
