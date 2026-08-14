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
    Sparkles,
    Plus,
    Search,
    Bell,
    Settings,
    Key,
    Users,
    LogOut,
    Copy,
    Check,
    MoreHorizontal,
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
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";
import { SnippetItem } from "@/components/snippets/SnippetCard";

export default function DashboardPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [snippets, setSnippets] = useState<SnippetItem[]>(SAMPLE_SNIPPETS);
    const [activeNav, setActiveNav] = useState<string>("dashboard");
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
            code: newCode,
            codePreview: newCode.split("\n").slice(0, 4),
            tags: newTags
                ? newTags.split(",").map((t) => (t.startsWith("#") ? t.trim() : `#${t.trim()}`))
                : ["#custom"],
            stars: 0,
            copies: 0,
            createdAt: "Just now",
            isPrivate: isEncrypted,
            author: {
                name: user?.displayName || user?.email?.split("@")[0] || "You",
                handle: user?.email?.split("@")[0] || "you",
            },
            gradientTheme: {
                glow: langColors[newLanguage] || "#6366F1",
                accent: "from-indigo-500/20",
            },
        };

        setSnippets([newSnippet, ...snippets]);
        setIsCreateOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewCode("");
        setNewTags("");
        setIsEncrypted(false);
        toast.success("New snippet saved to your vault!");
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

    return (
        <div className="flex h-screen w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
            {/* 1. Left Sidebar (Efferd Dashboard 2 inspired) */}
            <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 p-4">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 px-3 py-3 mb-4 group">
                    <div className="flex items-center rounded-lg bg-black/90 px-2.5 py-1 shadow-sm transition-all duration-300 group-hover:scale-105 border border-neutral-800">
                        <Image
                            src="/images/logo_codevault.png"
                            alt="CodeVault"
                            width={140}
                            height={35}
                            className="h-7 w-auto object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Primary Navigation */}
                <div className="space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                            Product
                        </p>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveNav("dashboard")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${activeNav === "dashboard"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
                                    }`}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveNav("snippets")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${activeNav === "snippets"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
                                    }`}
                            >
                                <FolderKanban className="h-4 w-4" />
                                <span>My Snippets</span>
                                <span className="ml-auto rounded-full bg-neutral-200/70 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold">
                                    {snippets.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav("vault")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${activeNav === "vault"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
                                    }`}
                            >
                                <Lock className="h-4 w-4 text-indigo-500" />
                                <span>Encrypted Vault</span>
                                <span className="ml-auto rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    AES-256
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveNav("starred")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${activeNav === "starred"
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
                                    }`}
                            >
                                <Star className="h-4 w-4 text-amber-500" />
                                <span>Favorites</span>
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                            Workspace
                        </p>
                        <nav className="space-y-1">
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60 transition-colors">
                                <Users className="h-4 w-4" />
                                <span>Team & Shares</span>
                            </button>
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60 transition-colors">
                                <Key className="h-4 w-4" />
                                <span>API Tokens</span>
                            </button>
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60 transition-colors">
                                <Settings className="h-4 w-4" />
                                <span>Vault Settings</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bottom User Card */}
                <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between rounded-xl bg-neutral-100 dark:bg-neutral-800/70 p-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-xs">
                                {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate text-xs">
                                <p className="font-semibold text-neutral-900 dark:text-white truncate">
                                    {user?.displayName || "Developer"}
                                </p>
                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                                    {user?.email || "developer@codevault.dev"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                clearAuth();
                                router.push("/login");
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. Main Dashboard Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 px-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
                            Developer Overview
                        </h1>
                        <span className="hidden sm:inline rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ● Vault Connected
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search input with Ctrl+K shortcut */}
                        <div className="relative hidden md:block w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search vault (Ctrl+K)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-12 text-xs text-neutral-900 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900"
                            />
                            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                                Ctrl+K
                            </kbd>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-indigo-500" />
                            )}
                        </button>

                        {/* Create New Snippet Button */}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Snippet</span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Dashboard Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 3. KPI Metrics Grid (Efferd Dashboard 2 style) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
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

                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
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

                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
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

                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
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
                                    Live links
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Snippets Management Table / List */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900/70 shadow-xs overflow-hidden">
                        {/* Table Header Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-neutral-200 dark:border-neutral-800">
                            {/* Tab Switcher */}
                            <div className="flex items-center gap-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "all"
                                            ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                            : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                        }`}
                                >
                                    All ({snippets.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("encrypted")}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "encrypted"
                                            ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                            : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                        }`}
                                >
                                    Encrypted ({encryptedCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab("starred")}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "starred"
                                            ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-900 dark:text-white"
                                            : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                        }`}
                                >
                                    Starred
                                </button>
                            </div>

                            {/* Filter Dropdown */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    <option value="All">All Languages</option>
                                    <option value="TypeScript">TypeScript</option>
                                    <option value="Python">Python</option>
                                    <option value="Rust">Rust</option>
                                    <option value="SQL">SQL</option>
                                    <option value="Go">Go</option>
                                    <option value="Docker">Docker</option>
                                </select>
                            </div>
                        </div>

                        {/* Snippets List Items */}
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                            {filteredSnippets.map((snippet) => (
                                <div
                                    key={snippet.id}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors"
                                >
                                    {/* Snippet Details */}
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                                                style={{
                                                    backgroundColor: `${snippet.langColor}15`,
                                                    color: snippet.langColor,
                                                }}
                                            >
                                                <span
                                                    className="h-1.5 w-1.5 rounded-full"
                                                    style={{ backgroundColor: snippet.langColor }}
                                                />
                                                {snippet.language}
                                            </span>

                                            <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                                                {snippet.title}
                                            </h3>

                                            {snippet.isPrivate && (
                                                <span className="flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                    <Lock className="h-2.5 w-2.5" />
                                                    Encrypted
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                            {snippet.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {snippet.tags.map((t) => (
                                                <span
                                                    key={t}
                                                    className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Metrics & Actions */}
                                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                        <div className="text-right text-xs text-neutral-400 hidden md:block">
                                            <p className="font-medium text-neutral-700 dark:text-neutral-300">
                                                {snippet.copies} copies
                                            </p>
                                            <p className="text-[10px]">{snippet.createdAt}</p>
                                        </div>

                                        <button
                                            onClick={(e) => handleCopy(snippet, e)}
                                            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:border-indigo-300 hover:text-indigo-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-indigo-700 transition-all"
                                        >
                                            {copiedId === snippet.id ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                    <span>Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={(e) => handleDelete(snippet.id, e)}
                                            className="p-2 text-neutral-400 hover:text-red-500 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                            title="Delete Snippet"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredSnippets.length === 0 && (
                                <div className="p-12 text-center">
                                    <Code2 className="mx-auto h-8 w-8 text-neutral-400" />
                                    <p className="mt-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                        No snippets found
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Try changing your filters or create a new snippet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Create Snippet Modal */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                                        Create New Code Snippet
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSnippet} className="mt-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Snippet Title *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. useDebounce React Hook"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Language
                                        </label>
                                        <select
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs font-medium text-neutral-800 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                        >
                                            <option value="TypeScript">TypeScript</option>
                                            <option value="Python">Python</option>
                                            <option value="Rust">Rust</option>
                                            <option value="SQL">SQL</option>
                                            <option value="Go">Go</option>
                                            <option value="Docker">Docker</option>
                                            <option value="JavaScript">JavaScript</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="#react, #hooks, #util"
                                            value={newTags}
                                            onChange={(e) => setNewTags(e.target.value)}
                                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Short summary of what this code does"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Source Code *
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="// Paste your code snippet here..."
                                        value={newCode}
                                        onChange={(e) => setNewCode(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-950 p-3 font-mono text-xs text-emerald-400 outline-none focus:border-indigo-500 dark:border-neutral-800"
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-3 border border-neutral-200 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <Lock className="h-4 w-4 text-indigo-500" />
                                        <div className="text-xs">
                                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                Zero-Knowledge Encryption
                                            </p>
                                            <p className="text-[10px] text-neutral-500">
                                                Encrypt snippet body with AES-256
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isEncrypted}
                                        onChange={(e) => setIsEncrypted(e.target.checked)}
                                        className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
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
                                        Save Snippet
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
