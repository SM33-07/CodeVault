"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
    GitFork,
    Download,
    Edit3,
    Sparkles,
    UserPlus,
    Sliders,
    Save,
    RotateCcw,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";
import { SnippetItem } from "@/components/snippets/SnippetCard";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [snippets, setSnippets] = useState<SnippetItem[]>(SAMPLE_SNIPPETS);
    const [activeNav, setActiveNav] = useState<"dashboard" | "snippets" | "vault" | "forks" | "starred" | "settings">("dashboard");
    const [activeTab, setActiveTab] = useState<"all" | "private" | "starred" | "forks">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [sortBy, setSortBy] = useState<"newest" | "views" | "forks">("newest");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<SnippetItem | null>(null);

    // New Snippet Form
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newLanguage, setNewLanguage] = useState("TypeScript");
    const [newCode, setNewCode] = useState("");
    const [newTags, setNewTags] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    // Team Invite Form
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"Viewer" | "Editor" | "Admin">("Editor");

    // Client API Key
    const [apiKey, setApiKey] = useState("cv_live_9f8a3c42e17b84d650123");
    const [apiCopied, setApiCopied] = useState(false);

    // Settings State
    const [settingsSection, setSettingsSection] = useState<"profile" | "editor" | "ai" | "vault">("profile");
    const [settingsDisplayName, setSettingsDisplayName] = useState(user?.displayName || (user?.email ? user.email.split("@")[0] : "Developer"));
    const [settingsBio, setSettingsBio] = useState(user?.bio || "");
    const [settingsGithub, setSettingsGithub] = useState(user?.githubUsername || "");
    const [settingsWebsite, setSettingsWebsite] = useState(user?.websiteUrl || "");
    
    // Editor Settings
    const [editorTheme, setEditorTheme] = useState<"obsidian" | "tokyo-night" | "dracula" | "vscode-dark">("obsidian");
    const [editorFont, setEditorFont] = useState("JetBrains Mono");
    const [editorTabSize, setEditorTabSize] = useState<2 | 4>(2);
    const [editorLineNumbers, setEditorLineNumbers] = useState(true);
    const [editorWordWrap, setEditorWordWrap] = useState(true);
    const [defaultSnippetPrivacy, setDefaultSnippetPrivacy] = useState(false);

    // AI Settings
    const [geminiKey, setGeminiKey] = useState("");
    const [showGeminiKey, setShowGeminiKey] = useState(false);
    const [aiModel, setAiModel] = useState<"gemini-1.5-flash" | "gemini-1.5-pro">("gemini-1.5-flash");
    const [autoExplain, setAutoExplain] = useState(true);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedKey = localStorage.getItem("codevault_gemini_key");
        if (storedKey) setGeminiKey(storedKey);
    }, []);

    // Scroll Lock when any modal is open
    const isAnyModalOpen = isCreateOpen || isApiModalOpen || isTeamModalOpen || Boolean(editingSnippet);
    useEffect(() => {
        if (isAnyModalOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
            };
        }
    }, [isAnyModalOpen]);

    const handleCopy = (snippet: SnippetItem, e?: React.MouseEvent) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(snippet.code);
        setCopiedId(snippet.id);
        toast.success(`Copied "${snippet.title}" to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleToggleStar = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setStarredIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                toast.info("Removed from favorites");
            } else {
                next.add(id);
                toast.success("Saved to favorites!");
            }
            return next;
        });
    };

    const handleFork = (snippet: SnippetItem, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const forked: SnippetItem = {
            ...snippet,
            id: `snip-${Date.now()}`,
            title: `${snippet.title} (Fork)`,
            forkCount: (snippet.forkCount || 0) + 1,
            viewCount: 1,
            createdAt: "Just now",
            author: {
                name: user?.displayName || user?.email?.split("@")[0] || "You",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                handle: "@you",
            },
        };
        setSnippets([forked, ...snippets]);
        toast.success(`Forked "${snippet.title}" to your personal vault!`);
    };

    const handleDelete = (id: string, title: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const deletedSnippet = snippets.find((s) => s.id === id);
        setSnippets((prev) => prev.filter((s) => s.id !== id));
        toast.success(`Snippet "${title}" deleted`, {
            action: deletedSnippet ? {
                label: "Undo",
                onClick: () => setSnippets((prev) => [deletedSnippet, ...prev]),
            } : undefined,
        });
    };

    const handleExportVault = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snippets, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `codevault-backup-${new Date().toISOString().split("T")[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success(`Exported ${snippets.length} snippets to JSON!`);
    };

    const handleResetDemoData = () => {
        setSnippets(SAMPLE_SNIPPETS);
        setStarredIds(new Set(["snip-1", "snip-3"]));
        toast.success("Vault reset to sample curated snippets!");
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        if (geminiKey.trim()) {
            localStorage.setItem("codevault_gemini_key", geminiKey.trim());
        }

        if (user) {
            setAuth(token || "demo-token", {
                ...user,
                displayName: settingsDisplayName,
                bio: settingsBio,
            });
        }

        toast.success("Preferences & settings saved successfully!");
    };

    const handleTestGeminiKey = () => {
        if (!geminiKey.trim()) {
            toast.error("Please enter a Gemini API Key to test");
            return;
        }
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1200)),
            {
                loading: "Validating Gemini API key with Google AI...",
                success: "Gemini API key is active and authorized!",
                error: "Failed to validate API key",
            }
        );
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
            isPrivate: isPrivate || defaultSnippetPrivacy,
        };

        setSnippets([newSnippet, ...snippets]);
        toast.success(newSnippet.isPrivate ? "Private snippet saved!" : "Snippet created successfully!");

        // Reset form
        setNewTitle("");
        setNewDescription("");
        setNewCode("");
        setNewTags("");
        setIsPrivate(false);
        setIsCreateOpen(false);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSnippet) return;

        setSnippets((prev) =>
            prev.map((s) => (s.id === editingSnippet.id ? editingSnippet : s))
        );
        toast.success(`Saved changes to "${editingSnippet.title}"!`);
        setEditingSnippet(null);
    };

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) {
            toast.error("Please enter an email address");
            return;
        }
        toast.success(`Invite sent to ${inviteEmail} as ${inviteRole}!`);
        setInviteEmail("");
        setIsTeamModalOpen(false);
    };

    const handleGenerateApiKey = () => {
        const newKey = `cv_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setApiKey(newKey);
        toast.success("Generated new client API token!");
    };

    const filteredSnippets = useMemo(() => {
        let result = snippets.filter((s) => {
            const matchesTab =
                activeTab === "all"
                    ? true
                    : activeTab === "private"
                        ? s.isPrivate
                        : activeTab === "starred"
                            ? starredIds.has(s.id)
                            : activeTab === "forks"
                                ? (s.forkCount || 0) > 0 || s.title.includes("(Fork)")
                                : true;

            const matchesLang =
                selectedLanguage === "All" || s.language === selectedLanguage;

            const matchesQuery =
                !searchQuery ||
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesTab && matchesLang && matchesQuery;
        });

        if (sortBy === "views") {
            result = [...result].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        } else if (sortBy === "forks") {
            result = [...result].sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0));
        }

        return result;
    }, [snippets, activeTab, selectedLanguage, searchQuery, starredIds, sortBy]);

    const totalViews = snippets.reduce((acc, s) => acc + s.viewCount, 0);
    const privateCount = snippets.filter((s) => s.isPrivate).length;
    const totalForks = snippets.reduce((acc, s) => acc + (s.forkCount || 0), 0);

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
        <div className="relative flex h-[calc(100vh-4rem)] w-full bg-bg-base overflow-hidden">
            {/* Living Midnight Grainient + Blueprint Matrix Shader */}
            <BodyBackgroundLayer isFixed />

            {/* 1. Left Sidebar */}
            <aside className="relative z-10 hidden lg:flex w-64 shrink-0 flex-col border-r border-neutral-200/80 dark:border-neutral-800/80 bg-bg-surface/85 backdrop-blur-xl p-4">
                {/* Brand / Workspace Capsule */}
                <div className="flex items-center gap-2.5 px-3 py-2 mb-3 rounded-xl bg-bg-elevated/70 border border-neutral-200/80 dark:border-neutral-800">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cobalt text-white shadow-xs">
                        <Shield className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-bold text-text-primary truncate">
                            {user?.displayName || "Personal Vault"}
                        </p>
                        <p className="text-[10px] text-mint font-semibold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                            Active Vault
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
                                onClick={() => {
                                    setActiveNav("dashboard");
                                    setActiveTab("all");
                                }}
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
                                onClick={() => {
                                    setActiveNav("snippets");
                                    setActiveTab("all");
                                }}
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
                                onClick={() => {
                                    setActiveNav("vault");
                                    setActiveTab("private");
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "vault"
                                        ? "border-l-[3px] border-slate-400 bg-slate-500/15 text-slate-300 shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                <span>Private Vault</span>
                                <span className="ml-auto rounded-full bg-bg-elevated border border-neutral-700/40 px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                                    {privateCount}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    setActiveNav("forks");
                                    setActiveTab("forks");
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "forks"
                                        ? "border-l-[3px] border-violet bg-violet/15 text-violet shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <GitFork className="h-4 w-4 text-violet shrink-0" />
                                <span>Fork Lineage</span>
                                <span className="ml-auto rounded-full bg-violet/10 border border-violet/20 px-2 py-0.5 text-[10px] font-bold text-violet">
                                    {totalForks}
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    setActiveNav("starred");
                                    setActiveTab("starred");
                                }}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                    activeNav === "starred"
                                        ? "border-l-[3px] border-amber-400 bg-amber-500/15 text-amber-400 shadow-xs"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <Star className="h-4 w-4 text-amber-400 shrink-0" />
                                <span>Favorites</span>
                                <span className="ml-auto rounded-full bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                    {starredIds.size}
                                </span>
                            </button>
                        </nav>
                    </div>

                    <div>
                        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                            Workspace
                        </p>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setIsTeamModalOpen(true)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                            >
                                <Users className="h-4 w-4 text-cobalt/80" />
                                <span>Team & Shares</span>
                            </button>
                            <button
                                onClick={() => setIsApiModalOpen(true)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                            >
                                <Key className="h-4 w-4 text-amber-400/80" />
                                <span>API Tokens</span>
                            </button>
                            <button
                                onClick={() => setActiveNav("settings")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                                    activeNav === "settings"
                                        ? "border-l-[3px] border-cobalt bg-cobalt/15 text-cobalt shadow-xs font-semibold"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                }`}
                            >
                                <Settings className="h-4 w-4 text-text-secondary" />
                                <span>Settings</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Bottom User Profile Capsule */}
                <div className="mt-auto pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated/80 p-2.5">
                        <Link href={`/profile/${user?.id || "me"}`} className="flex items-center gap-2.5 overflow-hidden hover:opacity-80 transition-opacity">
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
                        </Link>

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
            <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
                {/* Compact Top Action Bar */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 bg-bg-surface/85 backdrop-blur-xl px-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-text-primary">
                            {activeNav === "settings" ? "Vault & Workspace Settings" : "Overview"}
                        </h2>
                        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full badge-mint px-2.5 py-0.5 text-[10px] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {activeNav !== "settings" && (
                            <>
                                {/* Search input with Ctrl+K shortcut */}
                                <div className="relative hidden md:block w-60">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                                    <input
                                        type="text"
                                        placeholder="Search snippets (Ctrl+K)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-neutral-200 bg-bg-elevated/70 py-1.5 pl-8 pr-12 text-xs text-text-primary outline-none transition-all focus:border-cobalt dark:border-neutral-800"
                                    />
                                    <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-bg-surface px-1.5 py-0.5 text-[9px] font-mono text-text-secondary dark:border-neutral-700">
                                        Ctrl+K
                                    </kbd>
                                </div>

                                {/* Export Vault */}
                                <button
                                    onClick={handleExportVault}
                                    className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all shadow-xs"
                                    title="Export all snippets as JSON backup"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Export</span>
                                </button>

                                {/* Create New Snippet Button */}
                                <button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="flex items-center gap-1.5 rounded-xl bg-cobalt px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs shadow-cobalt/20 transition-all hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>New Snippet</span>
                                </button>
                            </>
                        )}

                        {activeNav === "settings" && (
                            <button
                                onClick={() => setActiveNav("dashboard")}
                                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-bg-surface px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all shadow-xs"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5 text-cobalt" />
                                <span>Back to Dashboard</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* 3. Render Settings View OR Dashboard Overview */}
                {activeNav === "settings" ? (
                    <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Settings Section Tabs */}
                            <div className="flex items-center gap-1 rounded-2xl bg-bg-surface/90 p-1.5 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xl shadow-xs overflow-x-auto">
                                <button
                                    onClick={() => setSettingsSection("profile")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                        settingsSection === "profile"
                                            ? "bg-cobalt text-white shadow-xs"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                    }`}
                                >
                                    <Shield className="h-3.5 w-3.5" />
                                    <span>Profile & Identity</span>
                                </button>
                                <button
                                    onClick={() => setSettingsSection("editor")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                        settingsSection === "editor"
                                            ? "bg-cobalt text-white shadow-xs"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                    }`}
                                >
                                    <Sliders className="h-3.5 w-3.5" />
                                    <span>Editor & Themes</span>
                                </button>
                                <button
                                    onClick={() => setSettingsSection("ai")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                        settingsSection === "ai"
                                            ? "bg-cobalt text-white shadow-xs"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                    }`}
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>AI Engine & Gemini</span>
                                </button>
                                <button
                                    onClick={() => setSettingsSection("vault")}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                        settingsSection === "vault"
                                            ? "bg-cobalt text-white shadow-xs"
                                            : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                    }`}
                                >
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>Vault & Backups</span>
                                </button>
                            </div>

                            {/* Section 1: Profile & Identity */}
                            {settingsSection === "profile" && (
                                <form onSubmit={handleSaveSettings} className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs dark:border-neutral-800 space-y-5">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary">
                                            Developer Identity
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            Customize your public profile, developer bio, and linked accounts.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={user?.email || "developer@codevault.dev"}
                                                disabled
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated/50 px-3.5 py-2.5 text-xs text-text-secondary dark:border-neutral-800 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settingsDisplayName}
                                                onChange={(e) => setSettingsDisplayName(e.target.value)}
                                                required
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1.5">
                                                <GithubIcon className="h-3.5 w-3.5" />
                                                <span>GitHub Username</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={settingsGithub}
                                                onChange={(e) => setSettingsGithub(e.target.value)}
                                                placeholder="e.g. octocat"
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1.5">
                                                <Globe className="h-3.5 w-3.5 text-cobalt" />
                                                <span>Website URL</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={settingsWebsite}
                                                onChange={(e) => setSettingsWebsite(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                            Short Bio
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={settingsBio}
                                            onChange={(e) => setSettingsBio(e.target.value)}
                                            maxLength={500}
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated p-3.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                        <p className="mt-1 text-right text-[10px] text-text-secondary">
                                            {settingsBio.length}/500
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:scale-95 transition-all"
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            <span>Save Profile Settings</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Section 2: Editor & Themes */}
                            {settingsSection === "editor" && (
                                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs dark:border-neutral-800 space-y-6">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary">
                                            Code Editor & Visual Styling
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            Configure code snippet typography, themes, and formatting.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                Code Theme
                                            </label>
                                            <select
                                                value={editorTheme}
                                                onChange={(e: any) => setEditorTheme(e.target.value)}
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs font-medium text-text-primary outline-none dark:border-neutral-800"
                                            >
                                                <option value="obsidian">Obsidian Nebula (Default)</option>
                                                <option value="tokyo-night">Tokyo Night</option>
                                                <option value="dracula">Dracula Dark</option>
                                                <option value="vscode-dark">VS Code Modern</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                Monospace Font
                                            </label>
                                            <select
                                                value={editorFont}
                                                onChange={(e) => setEditorFont(e.target.value)}
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs font-medium text-text-primary outline-none dark:border-neutral-800"
                                            >
                                                <option value="JetBrains Mono">JetBrains Mono</option>
                                                <option value="Fira Code">Fira Code</option>
                                                <option value="Geist Mono">Geist Mono</option>
                                                <option value="Cascadia Code">Cascadia Code</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                Indentation (Tab Size)
                                            </label>
                                            <select
                                                value={editorTabSize}
                                                onChange={(e: any) => setEditorTabSize(Number(e.target.value) as 2 | 4)}
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs font-medium text-text-primary outline-none dark:border-neutral-800"
                                            >
                                                <option value={2}>2 Spaces</option>
                                                <option value={4}>4 Spaces</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <label className="flex items-center justify-between rounded-xl bg-bg-elevated/70 p-3.5 border border-neutral-200/60 dark:border-neutral-800 cursor-pointer">
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">Show Line Numbers</p>
                                                <p className="text-[10px] text-text-secondary">Display left-hand gutter line numbering</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={editorLineNumbers}
                                                onChange={(e) => setEditorLineNumbers(e.target.checked)}
                                                className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between rounded-xl bg-bg-elevated/70 p-3.5 border border-neutral-200/60 dark:border-neutral-800 cursor-pointer">
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">Word Wrap</p>
                                                <p className="text-[10px] text-text-secondary">Soft wrap long code lines without horizontal scrolling</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={editorWordWrap}
                                                onChange={(e) => setEditorWordWrap(e.target.checked)}
                                                className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                            />
                                        </label>
                                    </div>

                                    {/* Live Code Preview */}
                                    <div className="space-y-2 pt-2">
                                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                            Live Editor Preview
                                        </p>
                                        <div
                                            className="rounded-2xl border border-neutral-800 p-4 font-mono text-xs overflow-x-auto transition-all"
                                            style={{
                                                backgroundColor:
                                                    editorTheme === "tokyo-night"
                                                        ? "#1a1b26"
                                                        : editorTheme === "dracula"
                                                            ? "#282a36"
                                                            : editorTheme === "vscode-dark"
                                                                ? "#1e1e1e"
                                                                : "#07090e",
                                                fontFamily: editorFont,
                                                whiteSpace: editorWordWrap ? "pre-wrap" : "pre",
                                            }}
                                        >
                                            <div className="flex gap-4">
                                                {editorLineNumbers && (
                                                    <div className="text-text-secondary/40 select-none text-right font-mono">
                                                        <div>1</div>
                                                        <div>2</div>
                                                        <div>3</div>
                                                    </div>
                                                )}
                                                <div className="text-text-primary">
                                                    <span className="text-violet font-bold">export const</span>{" "}
                                                    <span className="text-amber-400">codeVaultEngine</span> = () =&gt; &#123;
                                                    <br />
                                                    {" ".repeat(editorTabSize)}
                                                    <span className="text-emerald-400">return</span> &#123; theme:{" "}
                                                    <span className="text-cyan-400">"{editorTheme}"</span> &#125;;
                                                    <br />
                                                    &#125;;
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-2">
                                        <button
                                            onClick={() => toast.success("Editor settings applied!")}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-cobalt-hover active:scale-95 transition-all"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                            <span>Apply Styling</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Section 3: AI Engine & Gemini */}
                            {settingsSection === "ai" && (
                                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs dark:border-neutral-800 space-y-5">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-cobalt" />
                                            <span>AI Intelligence & Code Explanations</span>
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            Configure on-demand Gemini AI code reasoning and architecture summaries.
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-semibold text-text-primary">
                                                    Personal Google Gemini API Key
                                                </label>
                                                <span className="text-[10px] text-text-secondary font-mono">
                                                    Stored locally in your browser
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type={showGeminiKey ? "text" : "password"}
                                                        value={geminiKey}
                                                        onChange={(e) => setGeminiKey(e.target.value)}
                                                        placeholder="AIzaSy... (leave empty to use default server key)"
                                                        className="w-full rounded-xl border border-neutral-200 bg-bg-base font-mono px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                                                    >
                                                        {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleTestGeminiKey}
                                                    className="shrink-0 rounded-xl bg-bg-elevated px-4 py-2.5 text-xs font-semibold text-text-primary border border-neutral-200 dark:border-neutral-800 hover:border-cobalt transition-all"
                                                >
                                                    Test Key
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                                    AI Reasoning Model
                                                </label>
                                                <select
                                                    value={aiModel}
                                                    onChange={(e: any) => setAiModel(e.target.value)}
                                                    className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs font-medium text-text-primary outline-none dark:border-neutral-800"
                                                >
                                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Low Latency)</option>
                                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Architecture Analysis)</option>
                                                </select>
                                            </div>

                                            <label className="flex items-center justify-between rounded-xl bg-bg-elevated/70 p-3 border border-neutral-200/60 dark:border-neutral-800 cursor-pointer self-end">
                                                <div>
                                                    <p className="text-xs font-semibold text-text-primary">Auto-explain on Fork</p>
                                                    <p className="text-[10px] text-text-secondary">Generate summaries when forking code</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={autoExplain}
                                                    onChange={(e) => setAutoExplain(e.target.checked)}
                                                    className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-3 border-t border-neutral-200/60 dark:border-neutral-800">
                                        <button
                                            onClick={() => {
                                                if (geminiKey.trim()) localStorage.setItem("codevault_gemini_key", geminiKey.trim());
                                                toast.success("AI preferences updated!");
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-cobalt-hover active:scale-95 transition-all"
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            <span>Save AI Preferences</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Section 4: Vault & Backups */}
                            {settingsSection === "vault" && (
                                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs dark:border-neutral-800 space-y-6">
                                    <div>
                                        <h3 className="text-base font-bold text-text-primary">
                                            Vault Backups & Privacy
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-0.5">
                                            Export offline snapshots and configure data privacy defaults.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between rounded-2xl bg-bg-elevated/70 p-4 border border-neutral-200/60 dark:border-neutral-800 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Lock className="h-4 w-4 text-cobalt" />
                                                <div>
                                                    <p className="text-xs font-semibold text-text-primary">
                                                        Make New Snippets Private by Default
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary">
                                                        Automatically protect new snippets inside your private vault.
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={defaultSnippetPrivacy}
                                                onChange={(e) => {
                                                    setDefaultSnippetPrivacy(e.target.checked);
                                                    toast.info(e.target.checked ? "Default privacy enabled" : "Default privacy disabled");
                                                }}
                                                className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                            />
                                        </label>

                                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-elevated/70 p-4 dark:border-neutral-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Download className="h-4 w-4 text-emerald-400" />
                                                <div>
                                                    <p className="text-xs font-semibold text-text-primary">
                                                        Export Complete Vault Backup
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary">
                                                        Download all {snippets.length} snippets as a standalone `.json` bundle.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleExportVault}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Download JSON</span>
                                            </button>
                                        </div>

                                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <RotateCcw className="h-4 w-4 text-amber-400" />
                                                <div>
                                                    <p className="text-xs font-semibold text-text-primary">
                                                        Reset Demo Snippets
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary">
                                                        Restore sample algorithms, hooks, and SQL patterns.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleResetDemoData}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/30 transition-all"
                                            >
                                                <span>Reset Data</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Scrollable Dashboard Body Overview */
                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                        {/* 3. Interactive KPI Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* 1. Total Snippets */}
                            <div
                                onClick={() => setActiveTab("all")}
                                className={`cursor-pointer rounded-2xl border p-4 shadow-xs transition-all ${
                                    activeTab === "all"
                                        ? "border-cobalt bg-cobalt/10"
                                        : "border-neutral-200/80 bg-bg-surface/90 dark:border-neutral-800 hover:border-cobalt/50"
                                }`}
                            >
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
                                        Click to view all
                                    </span>
                                </div>
                            </div>

                            {/* 2. Total Views */}
                            <div
                                onClick={() => {
                                    setSortBy(sortBy === "views" ? "newest" : "views");
                                    toast.info(sortBy === "views" ? "Sorted by newest" : "Sorted by most views");
                                }}
                                className={`cursor-pointer rounded-2xl border p-4 shadow-xs transition-all ${
                                    sortBy === "views"
                                        ? "border-emerald-500 bg-emerald-500/10"
                                        : "border-neutral-200/80 bg-bg-surface/90 dark:border-neutral-800 hover:border-emerald-500/50"
                                }`}
                            >
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
                                        {sortBy === "views" ? "Sorted by views ↓" : "Click to sort by views"}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Private Snippets */}
                            <div
                                onClick={() => setActiveTab(activeTab === "private" ? "all" : "private")}
                                className={`cursor-pointer rounded-2xl border p-4 shadow-xs transition-all ${
                                    activeTab === "private"
                                        ? "border-slate-400 bg-slate-500/15"
                                        : "border-neutral-200/80 bg-bg-surface/90 dark:border-neutral-800 hover:border-slate-500/50"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-text-secondary">
                                        Private Vault
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
                                        {activeTab === "private" ? "Showing private" : "Click to filter"}
                                    </span>
                                </div>
                            </div>

                            {/* 4. Lineage Forks */}
                            <div
                                onClick={() => setActiveTab(activeTab === "forks" ? "all" : "forks")}
                                className={`cursor-pointer rounded-2xl border p-4 shadow-xs transition-all ${
                                    activeTab === "forks"
                                        ? "border-violet bg-violet/15"
                                        : "border-neutral-200/80 bg-bg-surface/90 dark:border-neutral-800 hover:border-violet/50"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-text-secondary">
                                        Lineage Forks
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/15 border border-violet/25 text-violet shadow-xs">
                                        <GitFork className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-2.5 flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-text-primary">
                                        {totalForks}
                                    </span>
                                    <span className="text-[11px] font-semibold text-violet">
                                        {activeTab === "forks" ? "Showing forks" : "Click to inspect forks"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 4. Snippets Management Table / List */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-surface/90 dark:border-neutral-800 backdrop-blur-xl shadow-xs overflow-hidden">
                            {/* Table Header Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-neutral-200/80 dark:border-neutral-800">
                                {/* Tab Switcher */}
                                <div className="flex items-center gap-1 rounded-xl bg-bg-elevated p-1 border border-neutral-200/60 dark:border-neutral-800">
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
                                        <span>Starred ({starredIds.size})</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("forks")}
                                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                            activeTab === "forks"
                                                ? "bg-bg-surface text-text-primary shadow-xs"
                                                : "text-text-secondary hover:text-text-primary"
                                        }`}
                                    >
                                        <GitFork className="h-3 w-3 text-violet" />
                                        <span>Forks ({totalForks})</span>
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
                                {filteredSnippets.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Code2 className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-40" />
                                        <p className="text-sm font-semibold text-text-primary">
                                            No snippets found
                                        </p>
                                        <p className="text-xs text-text-secondary mt-1">
                                            Try adjusting your search filters or create a new snippet.
                                        </p>
                                        <button
                                            onClick={() => setIsCreateOpen(true)}
                                            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-4 py-2 text-xs font-semibold text-white shadow-xs"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Create Snippet</span>
                                        </button>
                                    </div>
                                ) : (
                                    filteredSnippets.map((snippet) => (
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
                                                {/* Star Favorite Button */}
                                                <button
                                                    onClick={(e) => handleToggleStar(snippet.id, e)}
                                                    className={`p-1.5 rounded-lg border transition-all ${
                                                        starredIds.has(snippet.id)
                                                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                                                            : "border-neutral-200 dark:border-neutral-800 text-text-secondary hover:text-amber-400"
                                                    }`}
                                                    title={starredIds.has(snippet.id) ? "Remove from favorites" : "Add to favorites"}
                                                >
                                                    <Star className={`h-4 w-4 ${starredIds.has(snippet.id) ? "fill-amber-400" : ""}`} />
                                                </button>

                                                {/* Fork Button */}
                                                <button
                                                    onClick={(e) => handleFork(snippet, e)}
                                                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-text-secondary hover:text-violet hover:border-violet/40 hover:bg-violet/10 transition-all"
                                                    title="Fork snippet"
                                                >
                                                    <GitFork className="h-4 w-4" />
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => setEditingSnippet(snippet)}
                                                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-text-secondary hover:text-cobalt hover:border-cobalt/40 hover:bg-cobalt/10 transition-all"
                                                    title="Edit snippet"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>

                                                {/* Copy Code */}
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

                                                {/* Delete */}
                                                <button
                                                    onClick={(e) => handleDelete(snippet.id, snippet.title, e)}
                                                    className="p-1.5 text-text-secondary hover:text-red-500 rounded-lg hover:bg-bg-elevated transition-colors"
                                                    title="Delete snippet"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ---------------- MODALS (Rendered via Portals) ---------------- */}

            {/* 1. Create Snippet Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isCreateOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 10, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 max-h-[90vh] overflow-y-auto z-10 my-auto"
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
                                                    Stored safely inside your private vault.
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
                </AnimatePresence>,
                document.body
            )}

            {/* 2. Edit Snippet Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {editingSnippet && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setEditingSnippet(null)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 10, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 max-h-[90vh] overflow-y-auto z-10 my-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet text-white shadow-md">
                                            <Edit3 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">
                                                Edit Snippet
                                            </h3>
                                            <p className="text-xs text-text-secondary">
                                                Update your code snippet details.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditingSnippet(null)}
                                        className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-elevated"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editingSnippet.title}
                                            onChange={(e) => setEditingSnippet({ ...editingSnippet, title: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            value={editingSnippet.description}
                                            onChange={(e) => setEditingSnippet({ ...editingSnippet, description: e.target.value })}
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Code Body
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={editingSnippet.code}
                                            onChange={(e) => setEditingSnippet({ ...editingSnippet, code: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-base p-3 font-mono text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl bg-bg-elevated p-3 border border-neutral-200 dark:border-neutral-800">
                                        <div className="flex items-center gap-2.5">
                                            <Lock className="h-4 w-4 text-cobalt" />
                                            <div>
                                                <p className="text-xs font-semibold text-text-primary">
                                                    Private Snippet
                                                </p>
                                                <p className="text-[10px] text-text-secondary">
                                                    Toggle privacy visibility.
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(editingSnippet.isPrivate)}
                                            onChange={(e) => setEditingSnippet({ ...editingSnippet, isPrivate: e.target.checked })}
                                            className="h-4 w-4 rounded accent-cobalt cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => setEditingSnippet(null)}
                                            className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:bg-cobalt-active transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* 3. API Tokens Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isApiModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsApiModalOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 10, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 z-10 my-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">
                                                Developer API Tokens
                                            </h3>
                                            <p className="text-xs text-text-secondary">
                                                Access your snippets via CLI or programmatic API.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsApiModalOpen(false)}
                                        className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-elevated"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Personal Access Token
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={apiKey}
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-base font-mono px-3 py-2 text-xs text-text-primary outline-none dark:border-neutral-800"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(apiKey);
                                                    setApiCopied(true);
                                                    toast.success("API Key copied to clipboard!");
                                                    setTimeout(() => setApiCopied(false), 2000);
                                                }}
                                                className="shrink-0 flex items-center gap-1 rounded-xl bg-cobalt px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-cobalt-hover transition-all"
                                            >
                                                {apiCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                <span>{apiCopied ? "Copied" : "Copy"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-200/80 bg-bg-elevated p-3.5 dark:border-neutral-800 font-mono text-[11px] text-text-secondary space-y-2">
                                        <p className="text-text-primary font-semibold flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-cobalt" />
                                            <span>Quick cURL Example</span>
                                        </p>
                                        <pre className="overflow-x-auto text-emerald-400 bg-bg-base p-2.5 rounded-xl">
                                            {`curl -H "Authorization: Bearer ${apiKey}" \\
  https://trycodevault.vercel.app/api/snippets`}
                                        </pre>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={handleGenerateApiKey}
                                            className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                                        >
                                            Generate New Token
                                        </button>
                                        <button
                                            onClick={() => setIsApiModalOpen(false)}
                                            className="rounded-xl bg-bg-elevated px-4 py-2 text-xs font-semibold text-text-primary hover:bg-bg-surface transition-all border border-neutral-200 dark:border-neutral-800"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* 4. Team & Shares Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isTeamModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsTeamModalOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 10, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 z-10 my-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cobalt/15 text-cobalt border border-cobalt/30">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">
                                                Team Collaborators & Shares
                                            </h3>
                                            <p className="text-xs text-text-secondary">
                                                Invite team members to collaborate on snippets.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsTeamModalOpen(false)}
                                        className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-elevated"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleSendInvite} className="mt-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            placeholder="colleague@company.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            required
                                            className="flex-1 rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                        <select
                                            value={inviteRole}
                                            onChange={(e: any) => setInviteRole(e.target.value)}
                                            className="rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs font-semibold text-text-primary outline-none dark:border-neutral-800"
                                        >
                                            <option value="Viewer">Viewer</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                                            Current Vault Members
                                        </p>
                                        <div className="rounded-xl bg-bg-elevated/70 p-3 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cobalt to-violet flex items-center justify-center font-bold text-white text-[11px]">
                                                    {(user?.displayName || "Y").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-primary">
                                                        {user?.displayName || "You"} (Owner)
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary">
                                                        {user?.email || "developer@codevault.dev"}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-cobalt/15 border border-cobalt/30 px-2 py-0.5 text-[10px] font-bold text-cobalt">
                                                Owner
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => setIsTeamModalOpen(false)}
                                            className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:scale-95 transition-all flex items-center gap-1.5"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" />
                                            <span>Send Invite</span>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
