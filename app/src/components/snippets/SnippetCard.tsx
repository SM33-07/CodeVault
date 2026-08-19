"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Check,
    Copy,
    Lock,
    Globe,
    GitFork,
    Eye,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiPost } from "@/lib/api";
import { saveStoredFork, isForkSnippet } from "@/lib/vault-storage";

export interface SnippetItem {
    id: string;
    title: string;
    description: string;
    language: string;
    langColor: string;
    code: string;
    codePreview: string[];
    tags: string[];
    forkCount: number;
    viewCount: number;
    createdAt: string;
    isPrivate?: boolean;
    forkedFromId?: string | null;
    forkedFromTitle?: string;
    author: {
        name: string;
        avatar?: string;
        handle: string;
    };
    gradientTheme: {
        glow: string;
        accent: string;
    };
}

interface SnippetCardProps {
    snippet: SnippetItem;
    onTagClick?: (tag: string) => void;
}

export function SnippetCard({ snippet, onTagClick }: SnippetCardProps) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [isCopied, setIsCopied] = useState(false);
    const [isForking, setIsForking] = useState(false);
    const [forkCount, setForkCount] = useState(snippet.forkCount);
    const [isForkedByMe, setIsForkedByMe] = useState(false);

    const isForked = isForkSnippet(snippet);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(snippet.code);
        setIsCopied(true);
        toast.success(`Copied "${snippet.title}" to clipboard!`);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleFork = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isAuthenticated) {
            toast.info("Please sign in to save this fork to your personal vault");
            router.push(`/login?redirect=/snippets/${snippet.id}`);
            return;
        }

        if (isForking) return;

        setIsForking(true);
        try {
            const res = await apiPost<any>(
                `/api/snippets/${snippet.id}/fork`,
                {},
                token ?? undefined
            ).catch(() => null);

            const forkedSnippet = res || {
                id: `fork-${Date.now()}`,
                title: `${snippet.title} (Fork)`,
                description: `Forked from ${snippet.title}. Lineage preserved.`,
                language: snippet.language,
                langColor: snippet.langColor,
                code: snippet.code,
                codeBody: snippet.code,
                codePreview: snippet.codePreview,
                tags: Array.isArray(snippet.tags)
                    ? (snippet.tags.includes("forked") ? snippet.tags : [...snippet.tags, "forked"])
                    : ["forked"],
                forkCount: 0,
                viewCount: 1,
                isPrivate: false,
                forkedFromId: snippet.id,
                forkedFromTitle: snippet.title,
                isFork: true,
                createdAt: new Date().toISOString(),
                ownerId: user?.id || "me",
                author: {
                    name: user?.displayName || "You",
                    handle: `@${user?.displayName?.toLowerCase().replace(/\s+/g, "") || "developer"}`,
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                },
                gradientTheme: snippet.gradientTheme,
            };

            saveStoredFork(forkedSnippet);
            setForkCount((prev) => prev + 1);
            setIsForkedByMe(true);
            toast.success(`Forked "${snippet.title}" to your vault!`);
            
            if (forkedSnippet?.id) {
                setTimeout(() => {
                    router.push(`/snippets/${forkedSnippet.id}`);
                }, 600);
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to create fork");
        } finally {
            setIsForking(false);
        }
    };

    return (
        <motion.div
            initial={{ y: 15 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            whileHover={{
                y: -4,
                boxShadow: isForked
                    ? "0 20px 25px -5px rgba(124, 58, 237, 0.15), 0 8px 10px -6px rgba(124, 58, 237, 0.10)"
                    : "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.10)",
            }}
            transition={{ duration: 0.25 }}
            onClick={() => router.push(`/snippets/${snippet.id}`)}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border bg-bg-surface p-6 shadow-sm transition-all duration-300 cursor-pointer ${
                isForked
                    ? "border-neutral-200/80 hover:border-violet/60 dark:border-neutral-800/90 dark:hover:border-violet/50"
                    : "border-neutral-200/80 hover:border-cobalt/60 dark:border-neutral-800/90 dark:hover:border-cobalt/50"
            }`}
        >
            {/* Top-Right Ambient Corner Gradient */}
            <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ backgroundColor: isForked ? "#7C3AED" : (snippet.gradientTheme?.glow || "#3B82F6") }}
            />

            {/* Top Section */}
            <div>
                {/* Header: Date + Language + Action buttons */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                                backgroundColor: `${snippet.langColor}15`,
                                color: snippet.langColor,
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: snippet.langColor }}
                            />
                            {snippet.language}
                        </span>
                        <span className="text-xs text-text-secondary">
                            {snippet.createdAt}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Interactive Fork Button */}
                        <button
                            onClick={handleFork}
                            disabled={isForking}
                            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all duration-200 ${
                                isForkedByMe
                                    ? "bg-violet text-white shadow-md shadow-violet/25"
                                    : "bg-violet/10 border border-violet/20 text-violet hover:bg-violet/20 hover:border-violet/40 active:scale-95"
                            }`}
                            title="Fork this snippet to your vault"
                        >
                            <GitFork className={`h-3.5 w-3.5 ${isForking ? "animate-spin" : ""}`} />
                            <span>{isForking ? "Forking..." : `Fork (${forkCount})`}</span>
                        </button>

                        <button
                            onClick={handleCopy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                            title="Copy Snippet"
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-cobalt transition-colors line-clamp-1 flex items-center justify-between">
                        <span>{snippet.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity text-text-secondary" />
                    </h3>
                    {isForked && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md badge-violet px-2 py-0.5 text-[10px] font-semibold text-violet">
                            <GitFork className="h-3 w-3 text-violet" />
                            <span>Forked Snippet</span>
                            {snippet.forkedFromTitle && <span className="opacity-75 font-normal truncate">from {snippet.forkedFromTitle}</span>}
                        </div>
                    )}
                    <p className="mt-1 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {snippet.description}
                    </p>
                </div>

                {/* Syntax Peek Box */}
                <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-bg-base p-3 font-mono text-[11px] leading-relaxed text-text-primary shadow-inner dark:border-neutral-800">
                    <div className="space-y-0.5 opacity-90">
                        {snippet.codePreview.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="w-4 select-none text-right text-[10px] text-neutral-600">
                                    {idx + 1}
                                </span>
                                <span className="truncate text-text-primary font-mono">
                                    {line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80">
                {/* Tag Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
                    {snippet.tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onTagClick?.(tag)}
                            className="rounded-md bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] font-medium text-text-secondary transition-colors hover:border-cobalt hover:text-cobalt"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Author & Status Pill Capsule */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cobalt to-violet text-[10px] font-bold text-white shadow-sm">
                            {snippet.author.name.charAt(0)}
                        </div>
                        <span className="font-medium text-text-primary">
                            {snippet.author.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                            <Eye className="h-3 w-3" />
                            {snippet.viewCount}
                        </span>

                        <div className="flex items-center">
                            {snippet.isPrivate ? (
                                <span className="inline-flex items-center gap-1.5 badge-cobalt rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                                    <Lock className="h-3 w-3" />
                                    <span>Private</span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 badge-mint rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <Globe className="h-3 w-3" />
                                    <span>Public</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
