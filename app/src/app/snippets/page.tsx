"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Filter,
    Code2,
    Lock,
    Globe,
    Star,
    GitFork,
    Eye,
    Copy,
    Check,
    Sparkles,
    SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiGet } from "@/lib/api";
import { Snippet } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export default function SnippetsLibraryPage() {
    const router = useRouter();
    const { token, user, isAuthenticated } = useAuthStore();

    const [snippets, setSnippets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Debounce search input by 300ms (per Step 11 spec)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch snippets from backend API or fallback gracefully to initial dataset
    useEffect(() => {
        let isMounted = true;

        async function fetchSnippets() {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedQuery) params.append("q", debouncedQuery);
                if (selectedLanguage !== "All") params.append("language", selectedLanguage);
                if (selectedTag) params.append("tag", selectedTag.replace("#", ""));

                const path = `/api/snippets${params.toString() ? `?${params.toString()}` : ""}`;
                const data = await apiGet<Snippet[]>(path, token ?? undefined);

                if (isMounted && Array.isArray(data)) {
                    setSnippets(data);
                }
            } catch (err) {
                // Fallback to local sample dataset if backend server is not running
                if (isMounted) {
                    setSnippets(SAMPLE_SNIPPETS);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchSnippets();

        return () => {
            isMounted = false;
        };
    }, [debouncedQuery, selectedLanguage, selectedTag, token]);

    const handleCopy = (code: string, id: string, title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success(`Copied "${title}" to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const languagesList = [
        "All",
        "TypeScript",
        "Python",
        "Rust",
        "SQL",
        "Go",
        "Docker",
        "JavaScript",
    ];

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                            Snippet Library
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Search, explore, and fork battle-tested code snippets across languages.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create Snippet</span>
                        </Link>
                    </div>
                </div>

                {/* Filter Controls Bar (Search + Language Tabs + Tags) */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or #tag (Ctrl+K)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-12 text-xs text-neutral-900 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900"
                            />
                            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                                Ctrl+K
                            </kbd>
                        </div>

                        {/* Language Dropdown Selector */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full md:w-44 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs font-medium text-neutral-800 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                {languagesList.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang === "All" ? "All Languages" : lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Language Matrix Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {languagesList.map((lang) => {
                            const isActive = selectedLanguage === lang;
                            return (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all shrink-0 ${
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-xs"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    }`}
                                >
                                    {lang}
                                </button>
                            );
                        })}

                        {selectedTag && (
                            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 shrink-0">
                                <span>Tag: {selectedTag}</span>
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className="font-bold hover:opacity-75"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State Skeletons (Step 11 Spec) */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4"
                            >
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                                <div className="flex justify-between pt-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Snippet Grid / List */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {snippets.map((snippet) => {
                            const codeStr = snippet.codeBody || snippet.code || "";
                            const snippetTitle = snippet.title || "Untitled Snippet";
                            const langName = snippet.language || "Code";
                            const tagsList =
                                snippet.snippetTags?.map((st: any) => st.tag?.name) ||
                                snippet.tags ||
                                [];

                            return (
                                <motion.div
                                    key={snippet.id}
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-all hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-neutral-700"
                                >
                                    <div>
                                        {/* Card Header: Language badge + actions */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                {langName}
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={(e) =>
                                                        handleCopy(
                                                            codeStr,
                                                            snippet.id,
                                                            snippetTitle,
                                                            e
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                                                    title="Copy Code"
                                                >
                                                    {copiedId === snippet.id ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <Link href={`/snippets/${snippet.id}`} className="block mt-3">
                                            <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                {snippetTitle}
                                            </h3>
                                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                                {snippet.description || "No description provided."}
                                            </p>
                                        </Link>

                                        {/* Code Peek Box */}
                                        <div className="mt-4 overflow-hidden rounded-xl bg-neutral-950 p-3 font-mono text-[11px] text-neutral-300 border border-neutral-800">
                                            <pre className="line-clamp-3 text-neutral-300 leading-relaxed">
                                                {codeStr}
                                            </pre>
                                        </div>
                                    </div>

                                    {/* Bottom Metadata & Stats */}
                                    <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                                        {/* Tag pills */}
                                        <div className="flex flex-wrap items-center gap-1">
                                            {tagsList.slice(0, 2).map((t: string) => (
                                                <span
                                                    key={t}
                                                    onClick={() => setSelectedTag(t)}
                                                    className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-500 hover:text-indigo-600 cursor-pointer"
                                                >
                                                    {t.startsWith("#") ? t : `#${t}`}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stats (views / forks) */}
                                        <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {snippet.viewCount || snippet.copies || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="h-3 w-3" />
                                                {snippet.forkCount || snippet.stars || 0}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && snippets.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
                        <Code2 className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            No snippets found
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                            Try adjusting your search terms or create a new snippet.
                        </p>
                        <Link
                            href="/dashboard"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create Your First Snippet</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
