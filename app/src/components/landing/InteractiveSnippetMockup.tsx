"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    Copy,
    FileCode,
    Lock,
    Sparkles,
    Star,
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
    stars: number;
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
        description: "Zero-dependency JWT auth state hook with auto refresh",
        tags: ["#react", "#auth", "#jwt", "#hooks"],
        stars: 184,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-yellow-300">{"{ create }"}</span>{" "}
                        <span className="text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-emerald-300">&quot;zustand&quot;</span>;
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-yellow-300">{"{ persist }"}</span>{" "}
                        <span className="text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-emerald-300">&quot;zustand/middleware&quot;</span>;
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">export interface</span>{" "}
                        <span className="text-cyan-300">VaultUser</span>{" "}
                        <span className="text-white">{"{"}</span>
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-300">id</span>:{" "}
                        <span className="text-yellow-300">string</span>;{" "}
                        <span className="text-blue-300">email</span>:{" "}
                        <span className="text-yellow-300">string</span>;{" "}
                        <span className="text-blue-300">isEncrypted</span>:{" "}
                        <span className="text-yellow-300">boolean</span>;
                    </span>
                ),
            },
            { number: 6, code: <span className="text-white">{"}"}</span> },
            { number: 7, code: <span></span> },
            {
                number: 8,
                code: (
                    <>
                        <span className="text-neutral-500 italic">
                            {"// 🔒 Automatic 256-bit AES vault token encryption"}
                        </span>
                    </>
                ),
            },
            {
                number: 9,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">export const</span>{" "}
                        <span className="text-blue-400 font-medium">useAuthStore</span> ={" "}
                        <span className="text-cyan-300">create</span>
                        <span className="text-yellow-300">{"<AuthStore>()"}</span>(
                    </>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-4">
                        <span className="text-cyan-300">persist</span>((
                        <span className="text-orange-300">set</span>) =&gt; (
                        <span className="text-white">{"{"}</span>
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-8">
                        <span className="text-blue-300">user</span>:{" "}
                        <span className="text-orange-300">null</span>,{" "}
                        <span className="text-blue-300">token</span>:{" "}
                        <span className="text-orange-300">null</span>,
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-8">
                        <span className="text-blue-300">setAuth</span>: (
                        <span className="text-orange-300">token, user</span>) =&gt;{" "}
                        <span className="text-cyan-300">set</span>(
                        <span className="text-white">{"{ token, user, isAuthenticated: true }"}</span>),
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-4">
                        <span className="text-white">{"}"}</span>),{" "}
                        <span className="text-white">{"{ name: \"codevault-session\" }"}</span>
                    </span>
                ),
            },
            { number: 14, code: <span>);</span> },
        ],
    },
    {
        id: "cache",
        filename: "cache_decorator.py",
        language: "Python",
        langColor: "#3776AB",
        description: "Redis asynchronous TTL memoization decorator with fallback",
        tags: ["#python", "#redis", "#fastapi", "#async"],
        stars: 142,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-yellow-300">functools</span>,{" "}
                        <span className="text-yellow-300">json</span>
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">from</span>{" "}
                        <span className="text-yellow-300">redis.asyncio</span>{" "}
                        <span className="text-purple-400 font-semibold">import</span>{" "}
                        <span className="text-yellow-300">Redis</span>
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">def</span>{" "}
                        <span className="text-blue-400 font-medium">vault_cache</span>(
                        <span className="text-orange-300">ttl: int = 300</span>):
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-neutral-500 italic">
                            &quot;&quot;&quot;High performance distributed cache decorator&quot;&quot;&quot;
                        </span>
                    </span>
                ),
            },
            {
                number: 6,
                code: (
                    <span className="pl-4">
                        <span className="text-purple-400 font-semibold">def</span>{" "}
                        <span className="text-blue-400 font-medium">decorator</span>(
                        <span className="text-orange-300">func</span>):
                    </span>
                ),
            },
            {
                number: 7,
                code: (
                    <span className="pl-8">
                        <span className="text-yellow-400">@functools.wraps</span>(
                        <span className="text-orange-300">func</span>)
                    </span>
                ),
            },
            {
                number: 8,
                code: (
                    <span className="pl-8">
                        <span className="text-purple-400 font-semibold">async def</span>{" "}
                        <span className="text-blue-400 font-medium">wrapper</span>(
                        <span className="text-orange-300">*args, **kwargs</span>):
                    </span>
                ),
            },
            {
                number: 9,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-300">key</span> ={" "}
                        <span className="text-emerald-300">f&quot;vault:{"{func.__name__}"}:{"{args}"}&quot;</span>
                    </span>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-300">cached</span> ={" "}
                        <span className="text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-cyan-300">redis.get</span>(
                        <span className="text-blue-300">key</span>)
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-400 font-semibold">if</span>{" "}
                        <span className="text-blue-300">cached</span>:{" "}
                        <span className="text-purple-400 font-semibold">return</span>{" "}
                        <span className="text-cyan-300">json.loads</span>(
                        <span className="text-blue-300">cached</span>)
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-12">
                        <span className="text-blue-300">res</span> ={" "}
                        <span className="text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-cyan-300">func</span>(
                        <span className="text-orange-300">*args, **kwargs</span>)
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-400 font-semibold">await</span>{" "}
                        <span className="text-cyan-300">redis.setex</span>(
                        <span className="text-blue-300">key, ttl</span>,{" "}
                        <span className="text-cyan-300">json.dumps</span>(
                        <span className="text-blue-300">res</span>))
                    </span>
                ),
            },
            {
                number: 14,
                code: (
                    <span className="pl-12">
                        <span className="text-purple-400 font-semibold">return</span>{" "}
                        <span className="text-blue-300">res</span>
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
        stars: 96,
        lines: [
            {
                number: 1,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">use</span>{" "}
                        <span className="text-yellow-300">tokio::sync::mpsc</span>;
                    </>
                ),
            },
            {
                number: 2,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">use</span>{" "}
                        <span className="text-yellow-300">tokio::time</span>::
                        <span className="text-yellow-300">{"{Duration, Instant}"}</span>;
                    </>
                ),
            },
            { number: 3, code: <span></span> },
            {
                number: 4,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">pub struct</span>{" "}
                        <span className="text-cyan-300">RateLimiter</span>{" "}
                        <span className="text-white">{"{"}</span>
                    </>
                ),
            },
            {
                number: 5,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-300">capacity</span>:{" "}
                        <span className="text-yellow-300">usize</span>,
                    </span>
                ),
            },
            {
                number: 6,
                code: (
                    <span className="pl-4">
                        <span className="text-blue-300">refill_interval</span>:{" "}
                        <span className="text-yellow-300">Duration</span>,
                    </span>
                ),
            },
            { number: 7, code: <span className="text-white">{"}"}</span> },
            { number: 8, code: <span></span> },
            {
                number: 9,
                code: (
                    <>
                        <span className="text-purple-400 font-semibold">impl</span>{" "}
                        <span className="text-cyan-300">RateLimiter</span>{" "}
                        <span className="text-white">{"{"}</span>
                    </>
                ),
            },
            {
                number: 10,
                code: (
                    <span className="pl-4">
                        <span className="text-purple-400 font-semibold">pub async fn</span>{" "}
                        <span className="text-blue-400 font-medium">acquire</span>(
                        <span className="text-orange-300">&amp;mut self</span>) -&gt;{" "}
                        <span className="text-yellow-300">Result&lt;(), VaultError&gt;</span>{" "}
                        <span className="text-white">{"{"}</span>
                    </span>
                ),
            },
            {
                number: 11,
                code: (
                    <span className="pl-8">
                        <span className="text-neutral-500 italic">
                            {"// Instant lock acquire with zero allocation"}
                        </span>
                    </span>
                ),
            },
            {
                number: 12,
                code: (
                    <span className="pl-8">
                        <span className="text-cyan-300">Ok</span>(())
                    </span>
                ),
            },
            {
                number: 13,
                code: (
                    <span className="pl-4">
                        <span className="text-white">{"}"}</span>
                    </span>
                ),
            },
            { number: 14, code: <span>{"}"}</span> },
        ],
    },
];

export function InteractiveSnippetMockup() {
    const [activeTab, setActiveTab] = useState<string>("auth");
    const [copied, setCopied] = useState<boolean>(false);
    const [starred, setStarred] = useState<Record<string, boolean>>({});

    const currentSnippet =
        SNIPPET_TABS.find((tab) => tab.id === activeTab) || SNIPPET_TABS[0];

    const handleCopy = () => {
        setCopied(true);
        toast.success(`Copied ${currentSnippet.filename} to clipboard!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleStar = (id: string) => {
        setStarred((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="flex h-full w-full bg-neutral-950 text-neutral-200 select-none overflow-hidden">
            {/* Left Mini Sidebar (SaaS Dashboard layout) */}
            <div className="hidden md:flex w-48 shrink-0 flex-col border-r border-neutral-800/80 bg-neutral-900/60 p-3">
                {/* Brand */}
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 font-mono text-[10px] font-bold text-white shadow-xs">
                        CV
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight">
                        CodeVault
                    </span>
                </div>

                {/* Nav Items */}
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2.5 rounded-lg bg-indigo-600/20 px-2.5 py-1.5 font-medium text-indigo-300 border border-indigo-500/30">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-colors">
                        <FolderKanban className="h-3.5 w-3.5" />
                        <span>My Snippets</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-colors">
                        <Lock className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Private Vault</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200 transition-colors">
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        <span>Starred</span>
                    </div>
                </div>

                {/* Storage Meter */}
                <div className="mt-auto rounded-xl bg-neutral-900 p-3 border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                        <span>Vault Storage</span>
                        <span className="font-semibold text-white">142/500</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full w-[28%] rounded-full bg-indigo-500" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top IDE / Dashboard Window Header */}
                <div className="flex h-12 items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4">
                    {/* macOS Window Controls */}
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="ml-3 hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Vault Studio v1.0</span>
                        </div>
                    </div>

                    {/* Tabs Switcher */}
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                        {SNIPPET_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-neutral-800 text-white shadow-sm"
                                            : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                                    }`}
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: tab.langColor }}
                                    />
                                    <span>{tab.filename}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabGlow"
                                            className="absolute inset-0 rounded-lg border border-indigo-500/30"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleStar(currentSnippet.id)}
                            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                starred[currentSnippet.id]
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                            }`}
                            title="Star Snippet"
                        >
                            <Star
                                className={`h-3.5 w-3.5 ${
                                    starred[currentSnippet.id]
                                        ? "fill-amber-400 text-amber-400"
                                        : ""
                                }`}
                            />
                            <span className="hidden sm:inline">
                                {currentSnippet.stars + (starred[currentSnippet.id] ? 1 : 0)}
                            </span>
                        </button>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Row inside Mockup (like SaaS Template) */}
                <div className="grid grid-cols-3 gap-2 border-b border-neutral-800 bg-neutral-900/40 p-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-1.5 border border-neutral-800/80">
                        <span className="text-neutral-400">Total Snippets</span>
                        <span className="font-bold text-white">142</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-1.5 border border-neutral-800/80">
                        <span className="text-neutral-400">Total Copies</span>
                        <span className="font-bold text-emerald-400">4,820</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-1.5 border border-neutral-800/80">
                        <span className="text-neutral-400">Encryption</span>
                        <span className="font-bold text-indigo-400">AES-256</span>
                    </div>
                </div>

                {/* Sub-bar with description & tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 bg-neutral-950/60 px-4 py-2 text-xs">
                    <div className="flex items-center gap-2 text-neutral-400">
                        <span className="font-medium text-neutral-300">
                            {currentSnippet.description}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {currentSnippet.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Code Body */}
                <div className="relative flex-1 overflow-auto p-4 font-mono text-xs md:text-sm leading-relaxed">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSnippet.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-1"
                        >
                            {currentSnippet.lines.map((line) => (
                                <div
                                    key={line.number}
                                    className="group flex items-center hover:bg-white/[0.03] rounded px-2 -mx-2 transition-colors"
                                >
                                    <span className="w-8 shrink-0 select-none text-right font-mono text-neutral-600 text-xs pr-4 group-hover:text-neutral-500">
                                        {line.number}
                                    </span>
                                    <div className="flex-1 font-mono">{line.code}</div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Status Bar */}
                <div className="flex h-7 items-center justify-between border-t border-neutral-800/80 bg-neutral-900 px-3 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-indigo-400">
                            <Lock className="h-3 w-3" />
                            <span>AES-256 Vault Protected</span>
                        </div>
                        <div className="hidden sm:inline">UTF-8</div>
                        <div>{currentSnippet.language}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Instant Ctrl+K / ⌘K Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
