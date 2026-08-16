"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User,
    Calendar,
    Code2,
    Eye,
    Star,
    GitFork,
    Edit3,
    Lock,
    Globe,
    Copy,
    Check,
    Shield,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiGet } from "@/lib/api";
import { Snippet } from "@/types";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export default function UserProfilePage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { token, user: currentUser } = useAuthStore();

    const [profile, setProfile] = useState<any | null>(null);
    const [snippets, setSnippets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const isOwnProfile =
        currentUser?.id &&
        (currentUser.id === resolvedParams.userId || resolvedParams.userId === "me");

    useEffect(() => {
        let isMounted = true;

        async function loadProfileAndSnippets() {
            setIsLoading(true);
            try {
                const targetId =
                    resolvedParams.userId === "me" && currentUser?.id
                        ? currentUser.id
                        : resolvedParams.userId;

                const [userData, userSnippets] = await Promise.all([
                    apiGet<any>(`/api/users/${targetId}`, token ?? undefined).catch(() => null),
                    apiGet<any[]>(`/api/users/${targetId}/snippets`, token ?? undefined).catch(() => null),
                ]);

                if (isMounted) {
                    if (userData) {
                        setProfile(userData);
                    } else {
                        // Fallback profile if offline
                        setProfile({
                            id: targetId,
                            displayName: currentUser?.displayName || "Soham More",
                            email: currentUser?.email || "developer@codevault.dev",
                            bio: currentUser?.bio || "Full-stack engineer building high-performance developer tools, snippet managers, and distributed systems.",
                            createdAt: "Joined July 2026",
                        });
                    }

                    if (Array.isArray(userSnippets)) {
                        setSnippets(userSnippets);
                    } else {
                        setSnippets(SAMPLE_SNIPPETS);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setProfile({
                        id: resolvedParams.userId,
                        displayName: "Developer Profile",
                        email: "developer@codevault.dev",
                        bio: "Open source contributor & CodeVault creator.",
                        createdAt: "July 2026",
                    });
                    setSnippets(SAMPLE_SNIPPETS);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadProfileAndSnippets();

        return () => {
            isMounted = false;
        };
    }, [resolvedParams.userId, currentUser, token]);

    const handleCopy = (code: string, id: string, title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success(`Copied "${title}" to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-base p-8 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cobalt border-t-transparent mx-auto" />
            </div>
        );
    }

    const displayName = profile?.displayName || profile?.email?.split("@")[0] || "Developer";
    const totalViews = snippets.reduce((acc, s) => acc + (s.viewCount || 0), 0);

    return (
        <div className="min-h-full bg-bg-base pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                {/* Profile Header Banner */}
                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface p-6 sm:p-8 shadow-xs dark:border-neutral-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cobalt to-violet text-2xl sm:text-3xl font-extrabold text-white shadow-lg shadow-cobalt/20">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-text-primary">
                                        {displayName}
                                    </h1>
                                    {isOwnProfile && (
                                        <span className="rounded-full bg-cobalt/15 border border-cobalt/30 px-2.5 py-0.5 text-[11px] font-semibold text-cobalt">
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-text-secondary">
                                    {profile?.email}
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{profile?.createdAt || "Joined 2026"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            {isOwnProfile ? (
                                <Link
                                    href="/profile/settings"
                                    className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-cobalt/20 hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 transition-all"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Profile URL copied to clipboard!");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-bg-elevated px-4 py-2.5 text-xs font-semibold text-text-primary dark:border-neutral-800 hover:border-cobalt hover:text-cobalt transition-all"
                                >
                                    <span>Share Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                        <p className="text-sm text-text-primary leading-relaxed max-w-2xl">
                            {profile?.bio || "No biography provided yet."}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 text-xs">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-cobalt" />
                            <span className="text-text-secondary">
                                <strong className="text-text-primary font-bold">
                                    {snippets.length}
                                </strong>{" "}
                                Snippets
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-mint" />
                            <span className="text-text-secondary">
                                <strong className="text-text-primary font-bold">
                                    {totalViews}
                                </strong>{" "}
                                Total Views
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-violet" />
                            <span className="text-violet font-semibold">Verified Developer</span>
                        </div>
                    </div>
                </div>

                {/* Public Snippets List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-text-primary">
                        Public Code Snippets
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {snippets.map((snippet) => {
                            const codeStr = snippet.codeBody || snippet.code || "";
                            const snippetTitle = snippet.title || "Snippet";
                            const langName = snippet.language || "Code";

                            return (
                                <motion.div
                                    key={snippet.id}
                                    whileHover={{ y: -4 }}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-bg-surface p-5 shadow-xs hover:border-cobalt/60 dark:border-neutral-800"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-md bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-text-primary">
                                                    {langName}
                                                </span>
                                                <span className="inline-flex items-center gap-1 badge-mint rounded-full px-2 py-0.5 text-[10px] font-semibold">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span>Public</span>
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) =>
                                                    handleCopy(codeStr, snippet.id, snippetTitle, e)
                                                }
                                                className="p-1 text-text-secondary hover:text-text-primary"
                                            >
                                                {copiedId === snippet.id ? (
                                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>

                                        <Link href={`/snippets/${snippet.id}`} className="block mt-2">
                                            <h3 className="text-sm font-bold text-text-primary group-hover:text-cobalt transition-colors line-clamp-1">
                                                {snippetTitle}
                                            </h3>
                                            <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                                                {snippet.description || "Reusable snippet"}
                                            </p>
                                        </Link>

                                        <div className="mt-3 overflow-hidden rounded-xl bg-bg-base border border-neutral-800 p-2.5 font-mono text-[11px] text-text-primary">
                                            <pre className="line-clamp-3">{codeStr}</pre>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-text-secondary">
                                        <span>{snippet.viewCount || 0} views</span>
                                        <Link
                                            href={`/snippets/${snippet.id}`}
                                            className="font-semibold text-cobalt hover:underline"
                                        >
                                            View Code →
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
