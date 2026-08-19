"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Code2,
    Lock,
    Globe,
    Sparkles,
    Check,
    Loader2,
    Terminal,
    Tags,
    FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiPost } from "@/lib/api";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";
import { saveStoredSnippet, StoredSnippet } from "@/lib/vault-storage";

const AVAILABLE_LANGUAGES = [
    { name: "TypeScript", color: "#3178C6", ext: ".ts" },
    { name: "JavaScript", color: "#F7DF1E", ext: ".js" },
    { name: "Python", color: "#3776AB", ext: ".py" },
    { name: "Rust", color: "#DEA584", ext: ".rs" },
    { name: "Go", color: "#00ADD8", ext: ".go" },
    { name: "SQL", color: "#336791", ext: ".sql" },
    { name: "Docker", color: "#2496ED", ext: "Dockerfile" },
    { name: "Shell", color: "#89E051", ext: ".sh" },
    { name: "HTML/CSS", color: "#E34F26", ext: ".html" },
    { name: "JSON", color: "#CB171E", ext: ".json" },
];

export default function CreateSnippetPage() {
    const router = useRouter();
    const { token, user, isAuthenticated } = useAuthStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("TypeScript");
    const [codeBody, setCodeBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeLangObj =
        AVAILABLE_LANGUAGES.find((l) => l.name === language) ||
        AVAILABLE_LANGUAGES[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a snippet title");
            return;
        }

        if (!codeBody.trim()) {
            toast.error("Please enter code content for this snippet");
            return;
        }

        setIsSubmitting(true);

        try {
            // Process tags into clean string array
            const processedTags = tagsInput
                .split(",")
                .map((t) => t.trim().replace(/^#/, ""))
                .filter(Boolean);

            if (!isAuthenticated) {
                // If not logged in, notify and redirect to login
                toast.info("Please sign in or create an account to persist your snippets");
                router.push("/login?redirect=/snippets/new");
                return;
            }

            const payload = {
                title: title.trim(),
                description: description.trim() || undefined,
                language,
                codeBody: codeBody.trim(),
                visibility,
                tags: processedTags.length > 0 ? processedTags : undefined,
            };

            const createdSnippet = await apiPost<any>("/api/snippets", payload, token ?? undefined).catch(() => null);

            const snippetToSave: StoredSnippet = {
                id: createdSnippet?.id || `snip-${Date.now()}`,
                title: title.trim(),
                description: description.trim() || "User created code snippet",
                language,
                langColor: activeLangObj.color,
                code: codeBody.trim(),
                codeBody: codeBody.trim(),
                codePreview: codeBody.trim(),
                tags: processedTags.length > 0 ? processedTags : ["custom"],
                visibility,
                isPrivate: visibility === "private",
                viewCount: 0,
                forkCount: 0,
                createdAt: new Date().toISOString(),
                ownerId: user?.id || "me",
                author: {
                    name: user?.displayName || "You",
                    handle: `@${user?.displayName?.toLowerCase().replace(/\s+/g, "") || "developer"}`,
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                },
                gradientTheme: {
                    glow: "from-cobalt/20 to-violet/20",
                    accent: "text-cobalt",
                },
            };

            saveStoredSnippet(snippetToSave);
            toast.success(`Snippet "${title}" created successfully!`);

            setTimeout(() => {
                router.push(`/snippets/${snippetToSave.id}`);
            }, 500);
        } catch (err: any) {
            console.error("Failed to create snippet:", err);
            toast.error(err?.message || "Failed to create snippet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-bg-base py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <BodyBackgroundLayer isFixed />
            <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                {/* Back Link & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/snippets"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                                Create New Snippet
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Add a reusable function or algorithmic pattern to your vault.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setVisibility(visibility === "public" ? "private" : "public")
                            }
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                                visibility === "public"
                                    ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                        >
                            {visibility === "public" ? (
                                <>
                                    <Globe className="h-3.5 w-3.5" />
                                    <span>Public Snippet</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>Private Snippet</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface p-6 sm:p-8 shadow-xs dark:border-neutral-800 space-y-6">
                        {/* Title & Language Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-xs font-bold text-text-primary">
                                    Snippet Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. useDebounce hook with cleanup safety"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-primary">
                                    Language <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs font-medium text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                                    >
                                        {AVAILABLE_LANGUAGES.map((l) => (
                                            <option key={l.name} value={l.name}>
                                                {l.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-primary">
                                Description <span className="text-text-secondary font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Brief summary of what this code accomplishes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                            />
                        </div>

                        {/* Code Editor Window */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-text-primary">
                                    Code Body <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: activeLangObj.color }}
                                    />
                                    <span>{language}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-neutral-800 bg-bg-base shadow-inner overflow-hidden">
                                {/* Title bar */}
                                <div className="flex items-center justify-between border-b border-neutral-800 bg-bg-elevated px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                        <span className="ml-2 font-mono text-[11px] text-text-secondary">
                                            {title ? `${title.toLowerCase().replace(/\s+/g, "_")}${activeLangObj.ext}` : `snippet${activeLangObj.ext}`}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-text-secondary">
                                        UTF-8
                                    </span>
                                </div>

                                <textarea
                                    required
                                    rows={12}
                                    placeholder="// Paste or write your code here..."
                                    value={codeBody}
                                    onChange={(e) => setCodeBody(e.target.value)}
                                    className="w-full bg-transparent p-4 font-mono text-xs text-text-primary outline-none resize-y leading-relaxed"
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-primary">
                                Tags <span className="text-text-secondary font-normal">(Comma separated, e.g. react, hooks, performance)</span>
                            </label>
                            <div className="relative">
                                <Tags className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="react, auth, jwt, security"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-bg-elevated py-2.5 pl-9 pr-3.5 text-xs text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href="/snippets"
                            className="rounded-xl border border-neutral-200 bg-bg-surface px-5 py-2.5 text-xs font-semibold text-text-primary shadow-xs hover:bg-bg-elevated dark:border-neutral-800"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cobalt/25 transition-all hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving to Vault...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    <span>Publish Snippet</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
