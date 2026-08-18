"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    Lock,
    Star,
    Plus,
    Search,
    Users,
    Key,
    Settings,
    LogOut,
    Copy,
    Check,
    Code2,
    Shield,
    TrendingUp,
    Globe,
    Trash2,
    X,
    Filter,
    ChevronDown,
    Eye,
    GitFork,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";
import { SnippetItem } from "@/components/snippets/SnippetCard";

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [snippets, setSnippets] = useState<SnippetItem[]>(SAMPLE_SNIPPETS);
    const [activeNav, setActiveNav] = useState<string>("dashboard");
    const [activeTab, setActiveTab] = useState<"all" | "private" | "starred">("all");
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
    const [isPrivate, setIsPrivate] = useState(false);

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
        toast.success("Snippet deleted successfully");
    };

    const handleCreateSnippet = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newCode.trim()) {
            toast.error("Please provide both a title and code snippet");
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
            description: newDescription.trim() || "User created code snippet",
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
                glow: "from-cobalt/20 to-violet/20",
                accent: "text-cobalt",
            },
            tags: newTags
                ? newTags
                    .split(",")
                    .map((t) => (t.trim().startsWith("#") ? t.trim() : `#${t.trim()}`))
                : ["#custom", "#vault"],
            viewCount: 0,
            forkCount: 0,
            createdAt: "Just now",
            isPrivate: isPrivate,
        };

        setSnippets([newSnippet, ...snippets]);
        toast.success(
            isPrivate
                ? "Private snippet saved!"
                : "Snippet created successfully!"
        );

        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewCode("");
        setNewTags("");
        setIsPrivate(false);
        setIsCreateOpen(false);
    };

    const filteredSnippets = useMemo(() => {
        return snippets.filter((s) => {
            const matchesTab =
                activeTab === "all"
                    ? true
                    : activeTab === "private"
                        ? s.isPrivate
                        : false;

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

    const totalViews = snippets.reduce((acc, s) => acc + s.viewCount, 0);
    const privateCount = snippets.filter((s) => s.isPrivate).length;

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
        <div className="flex h-[calc(100vh-4rem)] w-full bg-bg-base overflow-hidden">
            {/* 1. Left Sidebar (Efferd Dashboard 2 inspired) */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-bg-surface p-4">
                {/* Brand / Workspace Capsule */}
                <div className="flex items-center gap-2.5 px-3 py-2 mb-3 rounded-xl bg-bg-elevated border border-neutral-200/80 dark:border-neutral-800">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cobalt text-white shadow-xs">
                        <Shield className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-bold text-text-primary truncate">
                            {user?.displayName || "Personal Vault"}
                        </p>
                        <p className="text-[10px] text-mint font-semibold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>

                {/* Primary Navigation */}
                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                    <div>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                            Product
                        </p>
                        <nav className="space-y-1.5">
                            <button
                                onClick={() => setActiveNav("dashboard")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "dashboard"
                                        ? "border-l-[3px] border-cobalt bg-cobalt/15 text-cobalt shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <LayoutDashboard className="h-4 w-4 text-cobalt shrink-0" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveNav("snippets")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "snippets"
                                        ? "border-l-[3px] border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <FolderKanban className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>My Snippets</span>
                                <span className="ml-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                    {snippets.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav("vault")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "vault"
                                        ? "border-l-[3px] border-slate-400 bg-slate-500/15 text-slate-300 shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                <span>Private Snippets</span>
                                <span className="ml-auto rounded-full bg-bg-elevated border border-neutral-700/40 px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                                    {privateCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav("lineage")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "lineage"
                                        ? "border-l-[3px] border-violet bg-violet/15 text-violet shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <GitFork className="h-4 w-4 text-violet shrink-0" />
                                <span>Fork Lineage</span>
                                <span className="ml-auto rounded-full bg-violet/10 border border-violet/20 px-2 py-0.5 text-[10px] font-bold text-violet">
                                    Tree
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav("starred")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "starred"
                                        ? "border-l-[3px] border-amber-400 bg-amber-500/15 text-amber-400 shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <Star className="h-4 w-4 text-amber-400 shrink-0" />
                                <span>Favorites</span>
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                            Workspace
                        </p>
                        <nav className="space-y-1">
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                                <Users className="h-4 w-4 text-cobalt/80" />
                                <span>Team & Shares</span>
                            </button>
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                                <Key className="h-4 w-4 text-amber-400/80" />
                                <span>API Tokens</span>
                            </button>
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                                <Settings className="h-4 w-4 text-text-secondary" />
                                <span>Settings</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bottom User Profile Capsule */}
                <div className="mt-auto pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated p-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cobalt to-violet text-xs font-bold text-white shadow-xs">
                                {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate text-xs">
                                <p className="font-semibold text-text-primary truncate">
                                    {user?.displayName || "Developer"}
                                </p>
                                <p className="text-[10px] text-text-secondary truncate">
                                    {user?.email || "developer@codevault.dev"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                clearAuth();
                                router.push("/login");
                            }}
                            className="p-1.5 text-text-secondary hover:text-red-500 rounded-lg hover:bg-bg-surface transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. Main Dashboard Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Compact Top Action Bar */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-bg-surface px-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-text-primary">
                            Overview
                        </h2>
                        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full badge-mint px-2.5 py-0.5 text-[10px] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>● Connected</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Compact Search input with Ctrl+K shortcut */}
                        <div className="relative hidden md:block w-60">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search snippets (Ctrl+K)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated py-1.5 pl-8 pr-12 text-xs text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                            />
                            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-bg-surface px-1.5 py-0.5 text-[9px] font-mono text-text-secondary dark:border-neutral-700">
                                Ctrl+K
                            </kbd>
                        </div>

                        {/* Create New Snippet Button */}
                        <Link
                            href="/snippets/new"
                            className="flex items-center gap-1.5 rounded-xl bg-cobalt px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs shadow-cobalt/20 transition-all hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>New Snippet</span>
                        </Link>
                    </div>
                </header>

                {/* Scrollable Dashboard Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {/* 3. KPI Metrics Grid with Distinct Restrained Tints */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Total Snippets: Cobalt */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-surface p-4 shadow-xs dark:border-neutral-800 transition-all hover:border-cobalt/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-text-secondary">
                                    Total Snippets
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cobalt/15 border border-cobalt/25 text-cobalt shadow-xs">
                                    <Code2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-baseline gap-2">
                                <span className="text-xl font-bold text-text-primary">
                                    {snippets.length}
                                </span>
                                <span className="text-[11px] font-semibold text-cobalt">
                                    +12% this month
                                </span>
                            </div>
                        </div>

                        {/* 2. Total Views: Mint */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-surface p-4 shadow-xs dark:border-neutral-800 transition-all hover:border-emerald-500/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-text-secondary">
                                    Total Views
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 shadow-xs">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-baseline gap-2">
                                <span className="text-xl font-bold text-text-primary">
                                    {totalViews.toLocaleString()}
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-400">
                                    +24% vs last week
                                </span>
                            </div>
                        </div>

                        {/* 3. Private Snippets: Restrained Slate/Gray */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-surface p-4 shadow-xs dark:border-neutral-800 transition-all hover:border-slate-500/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-text-secondary">
                                    Private Snippets
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-500/15 border border-slate-600/30 text-slate-400 shadow-xs">
                                    <Shield className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-baseline gap-2">
                                <span className="text-xl font-bold text-text-primary">
                                    {privateCount}
                                </span>
                                <span className="text-[11px] font-semibold text-text-secondary">
                                    Hidden from public
                                </span>
                            </div>
                        </div>

                        {/* 4. Public Shares / Forks: Violet */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-surface p-4 shadow-xs dark:border-neutral-800 transition-all hover:border-violet/50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-text-secondary">
                                    Public Shares
                                </span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/15 border border-violet/25 text-violet shadow-xs">
                                    <Globe className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-baseline gap-2">
                                <span className="text-xl font-bold text-text-primary">
                                    {snippets.length - privateCount}
                                </span>
                                <span className="text-[11px] font-semibold text-violet">
                                    Live shared links
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Snippets Management Table / List */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900/70 shadow-xs overflow-hidden">
                        {/* Table Header Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
                            {/* Tab Switcher */}
                            <div className="flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                        activeTab === "all"
                                            ? "bg-bg-surface text-text-primary shadow-xs"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    All ({snippets.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("private")}
                                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                        activeTab === "private"
                                            ? "bg-bg-surface text-text-primary shadow-xs"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <Lock className="h-3 w-3 text-cobalt" />
                                    <span>Private ({privateCount})</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("starred")}
                                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                        activeTab === "starred"
                                            ? "bg-bg-surface text-text-primary shadow-xs"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <Star className="h-3 w-3 text-amber-500" />
                                    <span>Starred</span>
                                </button>
                            </div>

                            {/* Language Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 text-text-secondary" />
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary outline-none dark:border-neutral-800"
                                >
                                    {languagesList.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang === "All" ? "All Languages" : lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Snippets List Rows */}
                        <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/80">
                            {filteredSnippets.map((snippet) => (
                                <div
                                    key={snippet.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-bg-elevated/40 transition-colors"
                                >
                                    <div className="flex items-start sm:items-center gap-3">
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white font-mono text-xs font-bold shadow-xs"
                                            style={{ backgroundColor: snippet.langColor || "#3B82F6" }}
                                        >
                                            {snippet.language.slice(0, 2).toUpperCase()}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/snippets/${snippet.id}`}
                                                    className="font-bold text-xs sm:text-sm text-text-primary hover:text-cobalt transition-colors"
                                                >
                                                    {snippet.title}
                                                </Link>
                                                {snippet.isPrivate && (
                                                    <span className="flex items-center gap-1 rounded bg-cobalt/10 border border-cobalt/20 px-1.5 py-0.5 text-[10px] font-medium text-cobalt">
                                                        <Lock className="h-2.5 w-2.5" />
                                                        Private
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                                                {snippet.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                {snippet.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary border border-neutral-800/50"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                                <span className="text-[10px] text-text-secondary ml-2">
                                                    • {snippet.language}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <button
                                            onClick={(e) => handleCopy(snippet, e)}
                                            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-bg-elevated transition-all shadow-xs"
                                        >
                                            {copiedId === snippet.id ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 text-mint" />
                                                    <span>Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 text-text-secondary" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={(e) => handleDelete(snippet.id, e)}
                                            className="p-1.5 text-text-secondary hover:text-red-500 rounded-lg hover:bg-bg-elevated transition-colors"
                                            title="Delete snippet"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredSnippets.length === 0 && (
                                <div className="p-8 text-center text-xs text-text-secondary">
                                    No snippets match the selected criteria.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Snippet Slide-Over Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cobalt text-white shadow-md shadow-cobalt/20">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary">
                                            Create New Snippet
                                        </h3>
                                        <p className="text-xs text-text-secondary">
                                            Add a reusable code snippet to your vault.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-elevated"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSnippet} className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="e.g. useDebounce hook"
                                            required
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Language
                                        </label>
                                        <select
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none dark:border-neutral-800"
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
                                    <label className="block text-xs font-semibold text-text-primary mb-1">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={newTags}
                                        onChange={(e) => setNewTags(e.target.value)}
                                        placeholder="e.g. react, hooks, utility"
                                        className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Short summary of snippet purpose..."
                                        className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-primary mb-1">
                                        Code Body *
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value)}
                                        placeholder="Paste or write your code here..."
                                        required
                                        className="w-full rounded-xl border border-neutral-200 bg-bg-base p-3 font-mono text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                    />
                                </div>

                                {/* Visibility Toggle */}
                                <div className="flex items-center justify-between rounded-xl bg-bg-elevated p-3 border border-neutral-200 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <Lock className="h-4 w-4 text-cobalt" />
                                        <div>
                                            <p className="text-xs font-semibold text-text-primary">
                                                Private Snippet
                                            </p>
                                            <p className="text-[10px] text-text-secondary">
                                                Hidden from public snippet library.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 transition-all"
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
