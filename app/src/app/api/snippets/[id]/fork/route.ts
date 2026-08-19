import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

        // 1. If an external backend is live, forward the fork request
        if (backendUrl && !backendUrl.includes("localhost")) {
            try {
                const authHeader = request.headers.get("authorization");
                const response = await fetch(`${backendUrl.replace(/\/+$/, "")}/api/snippets/${id}/fork`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data, { status: 201 });
                }
            } catch (err) {
                console.warn("External backend unreachable for fork, creating local fork:", err);
            }
        }

        // 2. Serverless Fork creation fallback
        const parent = SAMPLE_SNIPPETS.find((s) => s.id === id) || SAMPLE_SNIPPETS[0];
        
        // Increment parent fork count
        parent.forkCount = (parent.forkCount || 0) + 1;

        const forkedSnippet = {
            id: `fork-${Date.now()}`,
            title: `${parent.title} (Fork)`,
            description: `Forked from ${parent.title}. Customized for workspace integration.`,
            language: parent.language,
            langColor: parent.langColor,
            code: parent.code,
            codeBody: parent.code,
            codePreview: parent.codePreview,
            tags: [...(parent.tags || []), "forked"],
            forkCount: 0,
            viewCount: 1,
            isPrivate: false,
            forkedFromId: parent.id,
            forkedFromTitle: parent.title,
            isFork: true,
            createdAt: new Date().toISOString(),
            author: {
                name: "You",
                handle: "@developer",
            },
            gradientTheme: parent.gradientTheme,
        };

        return NextResponse.json(forkedSnippet, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Failed to fork snippet" },
            { status: 500 }
        );
    }
}
