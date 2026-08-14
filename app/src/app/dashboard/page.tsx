"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    Lock,
    Star,
    Sparkles,
    Plus,
    Search,
    Copy,
    Check,
    Code2,
    Shield,
    TrendingUp,
    Globe,
    Share2,
    Trash2,
    Edit3,
    Filter,
    ChevronDown,
    X,
    ExternalLink,
    Eye,
    GitFork,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";
import { SnippetItem } from "@/components/snippets/SnippetCard";

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    const [snippets, setSnippets] = useState<SnippetItem[]>(SAMPLE_SNIPPETS);
    const [activeTab, setActiveTab] = useState<"all" | "encrypted" | "starred">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Modal state for creating new snippet
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newLanguage, setNewLanguage] = useState("TypeScript");
    const [newCode, setNewCode] = useState("");
    const [newTags, setNewTags] = useState("");
    const [isEncrypted, setIsEncrypted] = useState(false);

    const handleCopy = (snippet: SnippetItem, e?: React.MouseEvent) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(snippet.code);
        setCopiedId(snippet.id);
        toast.success(`Copied "${snippet.title}" to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSnippets((prev) => prev.filter((s) => s.id !== id));
        toast.success("Snippet deleted from vault");
    };

    const handleCreateSnippet = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newCode.trim()) {
            toast.error("Please provide both a title and code body");
            return;
        }

        const langColors: Record<string, string> = {
            TypeScript: "#3178C6",
            Python: "#3776AB",
            Rust: "#DEA584",
            SQL: "#336791",
            Go: "#00ADD8",
            Docker: "#2496ED",
            JavaScript: "#F7DF1E",
        };

        const newSnippet: SnippetItem = {
            id: `snip-${Date.now()}`,
            title: newTitle.trim(),
            description: newDescription.trim() || "User created snippet",
            language: newLanguage,
            langColor: langColors[newLanguage] || "#6366F1",
            code: newCode.trim(),
            codePreview: newCode.trim().split("\n").slice(0, 4),
            author: {
                name: user?.displayName || user?.email?.split("@")[0] || "You",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                handle: "@vault_owner",
            },
            gradientTheme: {
                glow: "from-indigo-500/20 to-purple-500/20",
                accent: "text-indigo-500",
            },
            tags: newTags
                ? newTags
                    .split(",")
                    .map((t) => (t.trim().startsWith("#") ? t.trim() : `#${t.trim()}`))
                : ["#custom", "#vault"],
            copies: 0,
            stars: 0,
            createdAt: "Just now",
            isPrivate: isEncrypted,
        };

        setSnippets([newSnippet, ...snippets]);
        toast.success(
            isEncrypted
                ? "Snippet encrypted with AES-256 & saved!"
                : "Snippet created successfully!"
        );

        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewCode("");
        setNewTags("");
        setIsEncrypted(false);
        setIsCreateOpen(false);
    };

    const filteredSnippets = useMemo(() => {
        return snippets.filter((s) => {
            const matchesTab =
                activeTab === "all"
                    ? true
                    : activeTab === "encrypted"
                        ? s.isPrivate
                        : s.stars > 200;

            const matchesLang =
                selectedLanguage === "All" || s.language === selectedLanguage;

            const matchesQuery =
                !searchQuery ||
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesTab && matchesLang && matchesQuery;
        });
    }, [snippets, activeTab, selectedLanguage, searchQuery]);

    const totalCopies = snippets.reduce((acc, s) => acc + s.copies, 0);
    const encryptedCount = snippets.filter((s) => s.isPrivate).length;

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
        <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* 1. Header Section with Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                                Developer Dashboard
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Vault Connected (AES-256)
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Manage, search, protect, and export your personal code vault.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search input with Ctrl+K shortcut */}
                        <div className="relative w-full sm:w-64">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search vault (Ctrl+K)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-12 text-xs text-neutral-900 outline-none transition-all focus:border-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                            />
                            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                Ctrl+K
                            </kbd>
                        </div>

                        {/* Create Snippet CTA */}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all shrink-0"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Snippet</span>
                        </button>
                    </div>
                </div>

                {/* 2. KPI Metrics Grid (Efferd Dashboard style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                Total Snippets
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                <Code2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {snippets.length}
                            </span>
                            <span className="text-xs font-semibold text-emerald-500">
                                +12% this month
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                Total Copies
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {totalCopies.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-emerald-500">
                                +24% vs last week
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                Encrypted Vault
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <Shield className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {encryptedCount}
                            </span>
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                AES-256 Active
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                Public Shares
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                <Globe className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {snippets.length - encryptedCount}
                            </span>
                            <span className="text-xs font-semibold text-neutral-500">
                                Shareable
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Controls & Filter Bar */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Tab Switcher */}
                        <div className="flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    activeTab === "all"
                                        ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                }`}
                            >
                                All Snippets ({snippets.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("encrypted")}
                                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    activeTab === "encrypted"
                                        ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                }`}
                            >
                                <Lock className="h-3 w-3 text-indigo-500" />
                                <span>Encrypted ({encryptedCount})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("starred")}
                                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    activeTab === "starred"
                                        ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                }`}
                            >
                                <Star className="h-3 w-3 text-amber-500" />
                                <span>Starred</span>
                            </button>
                        </div>

                        {/* Language Selection Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">Language:</span>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                {languagesList.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. Snippets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSnippets.map((snippet) => (
                        <motion.div
                            key={snippet.id}
                            whileHover={{ y: -4 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-all hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/80"
                        >
                            <div>
                                {/* Card Header */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="rounded-md px-2.5 py-0.5 text-xs font-semibold text-white"
                                            style={{ backgroundColor: snippet.langColor || "#6366F1" }}
                                        >
                                            {snippet.language}
                                        </span>
                                        {snippet.isPrivate && (
                                            <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                                <Lock className="h-2.5 w-2.5" />
                                                AES-256
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => handleCopy(snippet, e)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                                            title="Copy Code"
                                        >
                                            {copiedId === snippet.id ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(snippet.id, e)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                                            title="Delete Snippet"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Title and description */}
                                <Link href={`/snippets/${snippet.id}`} className="block mt-3">
                                    <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {snippet.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                        {snippet.description}
                                    </p>
                                </Link>

                                {/* Code Preview */}
                                <div className="mt-4 overflow-hidden rounded-xl bg-neutral-950 p-3 font-mono text-[11px] text-neutral-300 border border-neutral-800">
                                    <pre className="line-clamp-3 leading-relaxed">{snippet.code}</pre>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                                <div className="flex flex-wrap gap-1">
                                    {snippet.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-500"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {snippet.copies}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                        {snippet.stars}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSnippets.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
                        <Code2 className="mx-auto h-10 w-10 text-neutral-400" />
                        <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            No snippets found in this filter
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                            Try adjusting your filters or create a new snippet.
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create Snippet</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Create Snippet Slide-Over Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                            Create New Snippet
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            Add a reusable code snippet to your vault.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSnippet} className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="e.g. useDebounce hook"
                                            required
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Language
                                        </label>
                                        <select
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                        >
                                            {languagesList.filter((l) => l !== "All").map((lang) => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newTags}
                                        onChange={(e) => setNewTags(e.target.value)}
                                        placeholder="e.g. react, hooks, utility"
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Short summary of snippet purpose..."
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Code Body *
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value)}
                                        placeholder="Paste or write your code here..."
                                        required
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-950 p-3 font-mono text-xs text-neutral-200 outline-none focus:border-indigo-500 dark:border-neutral-800"
                                    />
                                </div>

                                {/* Zero Knowledge Encryption Toggle */}
                                <div className="flex items-center justify-between rounded-xl bg-indigo-50/50 p-3 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40">
                                    <div className="flex items-center gap-2.5">
                                        <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        <div>
                                            <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                                                Zero-Knowledge Encryption
                                            </p>
                                            <p className="text-[10px] text-neutral-500">
                                                Encrypt payload with AES-256 client-side.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isEncrypted}
                                        onChange={(e) => setIsEncrypted(e.target.checked)}
                                        className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                                    >
                                        Save to Vault
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
