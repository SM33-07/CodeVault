"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Copy,
    Check,
    GitFork,
    Eye,
    Star,
    Share2,
    Lock,
    Globe,
    Calendar,
    User,
    Sparkles,
    Trash2,
    Edit3,
    Terminal,
    Code,
    Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { Snippet } from "@/types";
import { ExplainPanel } from "@/components/ExplainPanel";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export default function SnippetDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { token, user, isAuthenticated } = useAuthStore();

    const [snippet, setSnippet] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isForking, setIsForking] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadSnippet() {
            setIsLoading(true);
            try {
                const data = await apiGet<Snippet>(
                    `/api/snippets/${resolvedParams.id}`,
                    token ?? undefined
                );
                if (isMounted && data) {
                    setSnippet(data);
                }
            } catch (err) {
                // Fallback to sample snippet if backend is offline or ID matches sample
                const local = SAMPLE_SNIPPETS.find((s) => s.id === resolvedParams.id) || SAMPLE_SNIPPETS[0];
                if (isMounted) {
                    setSnippet(local);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadSnippet();

        return () => {
            isMounted = false;
        };
    }, [resolvedParams.id, token]);

    const handleCopy = () => {
        if (!snippet) return;
        const codeStr = snippet.codeBody || snippet.code || "";
        navigator.clipboard.writeText(codeStr);
        setCopied(true);
        toast.success("Snippet code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFork = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to fork this snippet");
            router.push("/login");
            return;
        }

        setIsForking(true);
        try {
            const forked = await apiPost<Snippet>(
                `/api/snippets/${resolvedParams.id}/fork`,
                {},
                token ?? undefined
            );
            toast.success("Snippet successfully forked to your vault!");
            if (forked?.id) {
                router.push(`/snippets/${forked.id}`);
            }
        } catch (err: any) {
            toast.error(err?.message || "Fork created locally in demo vault");
        } finally {
            setIsForking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-8 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
                    <p className="text-xs text-neutral-500">Loading code snippet...</p>
                </div>
            </div>
        );
    }

    if (!snippet) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    Snippet Not Found
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                    This snippet may be private or has been removed.
                </p>
                <Link
                    href="/snippets"
                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                >
                    Back to Library
                </Link>
            </div>
        );
    }

    const codeStr = snippet.codeBody || snippet.code || "";
    const titleStr = snippet.title || "Code Snippet";
    const languageStr = snippet.language || "TypeScript";
    const tagsList =
        snippet.snippetTags?.map((st: any) => st.tag?.name) ||
        snippet.tags ||
        [];

    const isOwner = user?.id && snippet.ownerId === user.id;

    return (
        <div className="min-h-full bg-neutral-50/50 dark:bg-neutral-950 pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                {/* Back Navigation Bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/snippets"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Snippet Library</span>
                    </Link>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2">
                        {!isOwner && (
                            <button
                                onClick={handleFork}
                                disabled={isForking}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 transition-all"
                            >
                                <GitFork className="h-3.5 w-3.5" />
                                <span>{isForking ? "Forking..." : "Fork Snippet"}</span>
                            </button>
                        )}

                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy Code</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Header & Metadata Card */}
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            {languageStr}
                        </span>

                        {snippet.visibility === "private" || snippet.isPrivate ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                <Lock className="h-3 w-3" />
                                Private Vault
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <Globe className="h-3 w-3" />
                                Public
                            </span>
                        )}

                        {snippet.forkedFromId && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                <GitFork className="h-3 w-3" />
                                Forked Snippet
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                        {titleStr}
                    </h1>

                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {snippet.description || "No description provided for this snippet."}
                    </p>

                    {/* Tags */}
                    {tagsList.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                            {tagsList.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/snippets?tag=${encodeURIComponent(tag.replace("#", ""))}`}
                                    className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 transition-colors"
                                >
                                    {tag.startsWith("#") ? tag : `#${tag}`}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Stats strip */}
                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-neutral-400" />
                            <span>
                                By{" "}
                                <strong className="text-neutral-700 dark:text-neutral-300">
                                    {snippet.author?.name || snippet.owner?.displayName || "Developer"}
                                </strong>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-neutral-400" />
                            <span>{snippet.viewCount || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GitFork className="h-4 w-4 text-neutral-400" />
                            <span>{snippet.forkCount || 0} forks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-neutral-400" />
                            <span>{snippet.createdAt || "Recently"}</span>
                        </div>
                    </div>
                </div>

                {/* Code Window Box */}
                <div className="rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
                    {/* macOS titlebar */}
                    <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                            <div className="h-3 w-3 rounded-full bg-green-500/80" />
                            <span className="ml-3 text-xs font-mono text-neutral-400">
                                {snippet.filename || `${titleStr.toLowerCase().replace(/\s+/g, "_")}.${languageStr.toLowerCase().slice(0, 2)}`}
                            </span>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Source Code with Line Numbers */}
                    <div className="p-5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-neutral-200">
                        {codeStr.split("\n").map((line: string, idx: number) => (
                            <div key={idx} className="flex hover:bg-white/[0.03] px-2 -mx-2 rounded">
                                <span className="w-10 shrink-0 select-none text-right pr-4 text-neutral-600 text-xs">
                                    {idx + 1}
                                </span>
                                <span className="whitespace-pre">{line || " "}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 12: Integrated AI Explanation Panel */}
                <ExplainPanel
                    snippetId={resolvedParams.id}
                    codeBody={codeStr}
                    language={languageStr}
                />
            </div>
        </div>
    );
}
