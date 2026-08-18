"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
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
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";
import { CyberLoader } from "@/components/ui/CyberLoader";

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
        return <CyberLoader fullscreen size="lg" label="Decrypting Snippet..." />;
    }

    if (!snippet) {
        return (
            <div className="min-h-screen bg-bg-base p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-lg font-bold text-text-primary">
                    Snippet Not Found
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                    This snippet may be private or has been removed.
                </p>
                <Link
                    href="/snippets"
                    className="mt-4 rounded-xl bg-cobalt px-4 py-2 text-xs font-semibold text-white hover:bg-cobalt-hover"
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
        <div className="relative min-h-screen bg-bg-base pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <BodyBackgroundLayer isFixed />
            <div className="relative z-10 mx-auto max-w-5xl space-y-8">
                {/* Back Navigation Bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/snippets"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-cobalt transition-colors"
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
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary shadow-xs hover:border-violet hover:text-violet dark:border-neutral-800 transition-all"
                            >
                                <GitFork className="h-3.5 w-3.5 text-violet" />
                                <span>{isForking ? "Forking..." : "Fork Snippet"}</span>
                            </button>
                        )}

                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cobalt/20 hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 transition-all"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-mint" />
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
                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface p-6 sm:p-8 shadow-xs dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="rounded-md bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs font-bold text-text-primary">
                            {languageStr}
                        </span>

                        {snippet.visibility === "private" || snippet.isPrivate ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md badge-cobalt px-2.5 py-1 text-xs font-semibold">
                                <Lock className="h-3.5 w-3.5" />
                                <span>Private Vault</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md badge-mint px-2.5 py-1 text-xs font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <Globe className="h-3.5 w-3.5" />
                                <span>Public</span>
                            </span>
                        )}

                        {snippet.forkedFromId && (
                            <span className="inline-flex items-center gap-1.5 rounded-md badge-violet px-2.5 py-1 text-xs font-semibold text-violet">
                                <GitFork className="h-3.5 w-3.5 text-violet" />
                                <span>Forked Snippet</span>
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                        {titleStr}
                    </h1>

                    {snippet.forkedFromId && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-violet/30 bg-violet/5 p-3 text-xs text-text-primary">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet/20 text-violet">
                                <GitFork className="h-4 w-4" />
                            </div>
                            <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                                <span>
                                    <strong className="text-violet font-semibold">Fork Lineage:</strong> This snippet originates from parent snippet{" "}
                                    <code className="font-mono text-[11px] bg-violet/15 text-violet px-1.5 py-0.5 rounded">
                                        {snippet.forkedFromId.slice(0, 8)}...
                                    </code>
                                </span>
                                <Link
                                    href={`/snippets/${snippet.forkedFromId}`}
                                    className="inline-flex items-center gap-1 font-semibold text-violet hover:underline"
                                >
                                    <span>View Parent Source</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    )}

                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        {snippet.description || "No description provided for this snippet."}
                    </p>

                    {/* Tags */}
                    {tagsList.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                            {tagsList.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/snippets?tag=${encodeURIComponent(tag.replace("#", ""))}`}
                                    className="rounded-lg bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-cobalt hover:text-cobalt transition-colors"
                                >
                                    {tag.startsWith("#") ? tag : `#${tag}`}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Stats strip */}
                    <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-wrap items-center gap-6 text-xs text-text-secondary">
                        <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-text-secondary" />
                            <span>
                                By{" "}
                                <strong className="text-text-primary">
                                    {snippet.author?.name || snippet.owner?.displayName || "Developer"}
                                </strong>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-emerald-400" />
                            <span><strong className="text-text-primary font-semibold">{snippet.viewCount || 0}</strong> views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GitFork className="h-4 w-4 text-violet" />
                            <span><strong className="text-violet font-semibold">{snippet.forkCount || 0}</strong> forks</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-text-secondary" />
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
