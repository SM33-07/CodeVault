"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Copy,
    FileCode,
    GitFork,
    Lock,
    Sparkles,
    Terminal,
    Share2,
    ShieldCheck,
    LayoutDashboard,
    FolderKanban,
    Search,
    Plus,
    Bell,
    Settings,
    TrendingUp,
    Code2,
    Layers,
    User,
    Moon,
} from "lucide-react";
import { toast } from "sonner";

interface SnippetTab {
    id: string;
    filename: string;
    language: string;
    langColor: string;
    description: string;
    tags: string[];
    forkCount: number;
    lines: {
        number: number;
        code: React.ReactNode;
    }[];
}

const SNIPPET_TABS: SnippetTab[] = [
    {
        id: "auth",
        filename: "useAuth.ts",
        language: "TypeScript",
        langColor: "#3178C6",
        description: "Zero-dependency JWT auth state hook with session persistence",
        tags: ["#react", "#auth", "#jwt", "#hooks"],
        forkCount: 0,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">{"{ create }"}</span>{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-emerald-600 dark:text-emerald-300">&quot;zustand&quot;</span>;
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">{"{ persist }"}</span>{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-emerald-600 dark:text-emerald-300">&quot;zustand/middleware&quot;</span>;
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">export interface</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">VaultUser</span>{" "}
                        <span className="text-text-primary font-mono">{"{"}</span>
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">id</span>:{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">string</span>;{" "}
                        <span className="text-blue-600 dark:text-blue-300 font-medium">email</span>:{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">string</span>;{" "}
                        <span className="text-blue-600 dark:text-blue-300 font-medium">displayName</span>:{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">string</span>;
                    </span>
                ),
            },
            { number: 6, code: <span className="text-text-primary font-mono">{"}"}</span> },
            { number: 7, code: <span></span> },
            {
                number: 8,
                code: (
                    <>
                        <span className="text-neutral-500 dark:text-neutral-400 italic">
                            {"// 🔗 JWT session with fork lineage & visibility tracking"}
                        </span>
                    </>
                ),
            },
            {
                number: 9,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">export const</span>{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">useAuthStore</span> ={" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">create</span>
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">{"<AuthStore>()"}</span>(
                    </>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-4">
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">persist</span>((
                        <span className="text-orange-600 dark:text-orange-300 font-medium">set</span>) =&gt; (
                        <span className="text-text-primary font-mono">{"{"}</span>
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-8">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">user</span>:{" "}
                        <span className="text-orange-600 dark:text-orange-300 font-medium">null</span>,{" "}
                        <span className="text-blue-600 dark:text-blue-300 font-medium">token</span>:{" "}
                        <span className="text-orange-600 dark:text-orange-300 font-medium">null</span>,
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-8">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">setAuth</span>: (
                        <span className="text-orange-600 dark:text-orange-300 font-medium">token, user</span>) =&gt;{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">set</span>(
                        <span className="text-text-primary font-mono">{"{ token, user, isAuthenticated: true }"}</span>),
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-4">
                        <span className="text-text-primary font-mono">{"}"}</span>),{" "}
                        <span className="text-text-primary font-mono">{"{ name: \"codevault-session\" }"}</span>
                    </span>
                ),
            },
            { number: 14, code: <span className="text-text-primary font-mono">);</span> },
        ],
    },
    {
        id: "cache",
        filename: "cache_decorator.py",
        language: "Python",
        langColor: "#3776AB",
        description: "Redis asynchronous TTL memoization decorator with fallback",
        tags: ["#python", "#redis", "#fastapi", "#async"],
        forkCount: 0,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">functools</span>,{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">json</span>
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">redis.asyncio</span>{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">Redis</span>
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">def</span>{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">vault_cache</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">ttl: int = 300</span>):
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-neutral-500 dark:text-neutral-400 italic">
                            &quot;&quot;&quot;High performance distributed cache decorator&quot;&quot;&quot;
                        </span>
                    </span>
                ),
            },
            {
                number: 6,
                code: (
                    <span className="pl-4">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">def</span>{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">decorator</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">func</span>):
                    </span>
                ),
            },
            {
                number: 7,
                code: (
                    <span className="pl-8">
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">@functools.wraps</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">func</span>)
                    </span>
                ),
            },
            {
                number: 8,
                code: (
                    <span className="pl-8">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">async def</span>{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">wrapper</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">*args, **kwargs</span>):
                    </span>
                ),
            },
            {
                number: 9,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">key</span> ={" "}
                        <span className="text-emerald-600 dark:text-emerald-300 font-mono">f&quot;vault:{"{func.__name__}"}:{"{args}"}&quot;</span>
                    </span>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">cached</span> ={" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">redis.get</span>(
                        <span className="text-blue-600 dark:text-blue-300 font-medium">key</span>)
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">if</span>{" "}
                        <span className="text-blue-600 dark:text-blue-300 font-medium">cached</span>:{" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">return</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">json.loads</span>(
                        <span className="text-blue-600 dark:text-blue-300 font-medium">cached</span>)
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">res</span> ={" "}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">func</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">*args, **kwargs</span>)
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">redis.setex</span>(
                        <span className="text-blue-600 dark:text-blue-300 font-medium">key, ttl</span>,{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">json.dumps</span>(
                        <span className="text-blue-600 dark:text-blue-300 font-medium">res</span>))
                    </span>
                ),
            },
            {
                number: 14,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">return</span>{" "}
                        <span className="text-blue-600 dark:text-blue-300 font-medium">res</span>
                    </span>
                ),
            },
        ],
    },
    {
        id: "limiter",
        filename: "rate_limiter.rs",
        language: "Rust",
        langColor: "#DEA584",
        description: "Token-bucket concurrency rate limiter using Tokio channels",
        tags: ["#rust", "#tokio", "#concurrency", "#ratelimit"],
        forkCount: 0,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">use</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">tokio::sync::mpsc</span>;
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">use</span>{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">tokio::time</span>::
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">{"{Duration, Instant}"}</span>;
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">pub struct</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">RateLimiter</span>{" "}
                        <span className="text-text-primary font-mono">{"{"}</span>
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">capacity</span>:{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">usize</span>,
                    </span>
                ),
            },
            {
                number: 6,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-600 dark:text-blue-300 font-medium">refill_interval</span>:{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">Duration</span>,
                    </span>
                ),
            },
            { number: 7, code: <span className="text-text-primary font-mono">{"}"}</span> },
            { number: 8, code: <span></span> },
            {
                number: 9,
                code: (
                    <>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">impl</span>{" "}
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">RateLimiter</span>{" "}
                        <span className="text-text-primary font-mono">{"{"}</span>
                    </>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-4">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">pub async fn</span>{" "}
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">acquire</span>(
                        <span className="text-orange-600 dark:text-orange-300 font-medium">&amp;mut self</span>) -&gt;{" "}
                        <span className="text-amber-600 dark:text-yellow-300 font-medium">Result&lt;(), VaultError&gt;</span>{" "}
                        <span className="text-text-primary font-mono">{"{"}</span>
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-8">
                        <span className="text-neutral-500 dark:text-neutral-400 italic">
                            {"// Instant lock acquire with zero allocation"}
                        </span>
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-8">
                        <span className="text-sky-600 dark:text-cyan-300 font-medium">Ok</span>(())
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-4">
                        <span className="text-text-primary font-mono">{"}"}</span>
                    </span>
                ),
            },
            { number: 14, code: <span className="text-text-primary font-mono">{"}"}</span> },
        ],
    },
];

export function InteractiveSnippetMockup() {
    const [activeTab, setActiveTab] = useState<string>("auth");
    const [copied, setCopied] = useState<boolean>(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const currentSnippet =
        SNIPPET_TABS.find((tab) => tab.id === activeTab) || SNIPPET_TABS[0];

    const handleCopy = () => {
        setCopied(true);
        toast.success(`Copied ${currentSnippet.filename} to clipboard!`);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({
            x: -y * 10,
            y: x * 14,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div
            className="flex h-full w-full bg-bg-base text-text-primary select-none overflow-hidden"
        >
            {/* Left Mini Sidebar (SaaS Dashboard layout) */}
            <div className="hidden md:flex w-48 shrink-0 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-bg-surface p-3">
                {/* Brand */}
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cobalt to-violet font-mono text-[10px] font-bold text-white shadow-xs">
                        CV
                    </div>
                    <span className="text-xs font-bold text-text-primary tracking-tight">
                        CodeVault
                    </span>
                </div>

                {/* Nav Items */}
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2.5 rounded-lg bg-cobalt/15 px-2.5 py-1.5 font-medium text-cobalt border border-cobalt/30">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                        <FolderKanban className="h-3.5 w-3.5" />
                        <span>My Snippets</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                        <Lock className="h-3.5 w-3.5 text-cobalt" />
                        <span>Private Vault</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors">
                        <GitFork className="h-3.5 w-3.5 text-violet" />
                        <span>Forked</span>
                    </div>
                </div>

                {/* Snippet Count */}
                <div className="mt-auto rounded-xl bg-bg-elevated p-3 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1.5">
                        <span>My Snippets</span>
                        <span className="font-semibold text-text-primary">{SNIPPET_TABS.length}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <div className="h-full w-[60%] rounded-full bg-cobalt" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top IDE / Dashboard Window Header */}
                <div className="flex h-12 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-bg-surface px-4">
                    {/* macOS Window Controls */}
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="ml-3 hidden sm:flex items-center gap-1.5 text-xs text-text-secondary font-mono">
                            <ShieldCheck className="h-3.5 w-3.5 text-cobalt" />
                            <span>Vault Studio v1.0</span>
                        </div>
                    </div>

                    {/* Tabs Switcher with Sliding layoutId */}
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {SNIPPET_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                        isActive
                                            ? "text-text-primary"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 rounded-lg bg-bg-elevated border border-cobalt/40 shadow-xs"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <span
                                        className="relative z-10 h-2 w-2 rounded-full"
                                        style={{ backgroundColor: tab.langColor }}
                                    />
                                    <span className="relative z-10">{tab.filename}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <span
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-secondary"
                            title="Fork count"
                        >
                            <GitFork className="h-3.5 w-3.5 text-violet" />
                            <span className="hidden sm:inline">
                                {currentSnippet.forkCount}
                            </span>
                        </span>

                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200 active:scale-95 ${
                                copied
                                    ? "bg-emerald-500 shadow-emerald-500/30"
                                    : "bg-cobalt hover:bg-cobalt-hover active:bg-cobalt-active"
                            }`}
                        >
                            {copied ? (
                                <motion.div
                                    initial={{ scale: 0.7 }}
                                    animate={{ scale: [0.7, 1.25, 1] }}
                                    transition={{ duration: 0.25 }}
                                    className="flex items-center gap-1"
                                >
                                    <Check className="h-3.5 w-3.5 text-white" />
                                    <span>Copied!</span>
                                </motion.div>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Row inside Mockup */}
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-bg-surface/50 p-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-800/80">
                        <span className="text-text-secondary">Snippets</span>
                        <span className="font-bold text-text-primary">{SNIPPET_TABS.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-800/80">
                        <span className="text-text-secondary">Forks</span>
                        <span className="font-bold text-violet">{currentSnippet.forkCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-800/80">
                        <span className="text-text-secondary">Visibility</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Public</span>
                    </div>
                </div>

                {/* Sub-bar with description & tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-bg-base px-4 py-2 text-xs">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <span className="font-medium text-text-primary">
                            {currentSnippet.description}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {currentSnippet.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] text-text-secondary hover:border-cobalt hover:text-cobalt transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Code Body */}
                <div className="relative flex-1 overflow-auto p-4 font-mono text-xs md:text-sm leading-relaxed bg-bg-base">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSnippet.id}
                            initial={{ y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-1"
                        >
                            {currentSnippet.lines.map((line) => (
                                <div
                                    key={line.number}
                                    className="group flex items-center hover:bg-neutral-500/5 rounded px-2 -mx-2 transition-colors"
                                >
                                    <span className="w-8 shrink-0 select-none text-right font-mono text-neutral-400 dark:text-neutral-600 text-xs pr-4 group-hover:text-neutral-500">
                                        {line.number}
                                    </span>
                                    <div className="flex-1 font-mono text-text-primary">{line.code}</div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Status Bar */}
                <div className="flex h-7 items-center justify-between border-t border-neutral-200 dark:border-neutral-800 bg-bg-surface px-3 text-[11px] text-text-secondary">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-violet font-medium">
                            <GitFork className="h-3 w-3" />
                            <span>Fork Lineage Active</span>
                        </div>
                        <div className="hidden sm:inline">UTF-8</div>
                        <div>{currentSnippet.language}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-mint font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                            <span>Instant Ctrl+K / ⌘K Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
