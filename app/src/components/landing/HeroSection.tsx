"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, GitFork, Terminal, Shield, Lock, Copy } from "lucide-react";
import { toast } from "sonner";

export function HeroSection() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, text: string, label: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success(`Copied snippet: ${label}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center text-center px-4 pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12">
            {/* Direct Atmospheric Background Gradient & Grid Layer */}
            <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[700px] w-full overflow-hidden">
                {/* Top-Right Vivid Violet Glow */}
                <div
                    className="absolute -top-10 -right-10 h-[550px] w-[550px] rounded-full opacity-60 dark:opacity-75 blur-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, transparent 70%)",
                    }}
                />
                {/* Bottom-Left/Center Vivid Emerald/Mint Glow */}
                <div
                    className="absolute top-44 -left-16 h-[500px] w-[500px] rounded-full opacity-50 dark:opacity-65 blur-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.15) 50%, transparent 70%)",
                    }}
                />
                {/* Center / Top-Left Soft Cobalt Tint */}
                <div
                    className="absolute top-10 left-[15%] h-[400px] w-[400px] rounded-full opacity-35 dark:opacity-45 blur-[90px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                    }}
                />
                {/* High-Definition 1px Background Grid */}
                <div
                    className="absolute inset-0 opacity-40 dark:opacity-60"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(59, 130, 246, 0.18) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.18) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                        maskImage: "radial-gradient(ellipse 90% 75% at 50% 35%, black 40%, transparent 85%)",
                        WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 35%, black 40%, transparent 85%)",
                    }}
                />
            </div>

            {/* Left Flanking Snippets (Desktop Only - Animate with Header) */}
            <div className="hidden lg:block pointer-events-auto">
                {/* Snippet 1: useFork (Top-Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -3, rotateZ: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleCopy("fork", "const lineage = useFork(originId);", "useFork()", e)}
                    className="absolute top-16 left-0 xl:-left-12 2xl:-left-20 z-20 cursor-pointer animate-float-1 text-left max-w-[210px]"
                >
                    <div className="rounded-xl border border-neutral-200/80 bg-bg-surface/85 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg shadow-violet/10 backdrop-blur-md dark:border-neutral-800/80 dark:bg-bg-surface/80 hover:border-violet hover:shadow-xl hover:shadow-violet/25 transition-all duration-200">
                        <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-neutral-200/60 dark:border-neutral-700/40 text-[10px] text-violet">
                            <span className="flex items-center gap-1 font-bold">
                                <GitFork className="h-3 w-3 text-violet animate-pulse" />
                                <span>useFork.ts</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="rounded bg-violet/10 px-1 py-0.5 text-[8.5px] font-semibold text-violet">
                                    #root
                                </span>
                                {copiedId === "fork" ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3 opacity-50" />
                                )}
                            </div>
                        </div>
                        <p className="text-text-primary font-mono text-[10.5px] truncate">
                            <span className="text-cobalt font-semibold">const</span> lin = <span className="text-violet font-semibold">useFork</span>();
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[9px] text-text-secondary">
                            <span>Depth: <strong className="text-mint">3 forks</strong></span>
                            <span className="text-violet/80">Click copy</span>
                        </div>
                    </div>
                </motion.div>

                {/* Snippet 2: Vault Enclave (Bottom-Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -3, rotateZ: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleCopy("vault", "state: ENCRYPTED_LOCAL // Air-gapped Zero Telemetry", "Vault Enclave", e)}
                    className="absolute top-44 left-0 xl:-left-12 2xl:-left-20 z-20 cursor-pointer animate-float-3 text-left max-w-[210px]"
                >
                    <div className="rounded-xl border border-neutral-200/80 bg-bg-surface/85 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg shadow-mint/10 backdrop-blur-md dark:border-neutral-800/80 dark:bg-bg-surface/80 hover:border-mint hover:shadow-xl hover:shadow-mint/25 transition-all duration-200">
                        <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-neutral-200/60 dark:border-neutral-700/40 text-[10px] text-emerald-400">
                            <span className="flex items-center gap-1 font-bold">
                                <Shield className="h-3 w-3 text-emerald-400" />
                                <span>Vault Enclave</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {copiedId === "vault" ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3 opacity-50" />
                                )}
                            </div>
                        </div>
                        <p className="text-text-primary font-mono text-[10.5px] truncate">
                            state: <span className="text-emerald-400 font-semibold">ENCRYPTED</span>
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[9px] text-text-secondary">
                            <span>Air-gapped local</span>
                            <span className="text-emerald-400/80">Click copy</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Flanking Snippets (Desktop Only - Animate with Header) */}
            <div className="hidden lg:block pointer-events-auto">
                {/* Snippet 3: CLI Pull (Top-Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -3, rotateZ: 1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleCopy("cli", "$ cv pull #snip-rbac-jwt", "CLI Pull", e)}
                    className="absolute top-16 right-0 xl:-right-12 2xl:-right-20 z-20 cursor-pointer animate-float-2 text-left max-w-[210px]"
                >
                    <div className="rounded-xl border border-neutral-200/80 bg-bg-surface/85 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg shadow-cobalt/10 backdrop-blur-md dark:border-neutral-800/80 dark:bg-bg-surface/80 hover:border-cobalt hover:shadow-xl hover:shadow-cobalt/25 transition-all duration-200">
                        <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-neutral-200/60 dark:border-neutral-700/40 text-[10px] text-cobalt">
                            <span className="flex items-center gap-1 font-bold">
                                <Terminal className="h-3 w-3 text-cobalt" />
                                <span>cli-provenance</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="rounded bg-cobalt/10 px-1 py-0.5 text-[8.5px] font-semibold text-cobalt">
                                    &lt;50ms
                                </span>
                                {copiedId === "cli" ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3 opacity-50" />
                                )}
                            </div>
                        </div>
                        <p className="text-text-primary font-mono text-[10.5px] truncate">
                            $ cv pull <span className="text-emerald-400 font-semibold">#snip-jwt</span>
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[9px] text-text-secondary">
                            <span>PostgreSQL CTE</span>
                            <span className="text-cobalt/80">Click copy</span>
                        </div>
                    </div>
                </motion.div>

                {/* Snippet 4: authGuard (Bottom-Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -3, rotateZ: 1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleCopy("guard", "const auth = await verifyJwt(token, secret);", "verifyJwt()", e)}
                    className="absolute top-44 right-0 xl:-right-12 2xl:-right-20 z-20 cursor-pointer animate-float-1 text-left max-w-[210px]"
                >
                    <div className="rounded-xl border border-neutral-200/80 bg-bg-surface/85 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg shadow-violet/10 backdrop-blur-md dark:border-neutral-800/80 dark:bg-bg-surface/80 hover:border-violet hover:shadow-xl hover:shadow-violet/25 transition-all duration-200">
                        <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-neutral-200/60 dark:border-neutral-700/40 text-[10px] text-violet">
                            <span className="flex items-center gap-1 font-bold">
                                <Lock className="h-3 w-3 text-violet" />
                                <span>authGuard.ts</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="rounded bg-violet/10 px-1 py-0.5 text-[8.5px] font-semibold text-violet">
                                    JWT
                                </span>
                                {copiedId === "guard" ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                    <Copy className="h-3 w-3 opacity-50" />
                                )}
                            </div>
                        </div>
                        <p className="text-text-primary font-mono text-[10.5px] truncate">
                            <span className="text-cobalt font-semibold">const</span> a = <span className="text-violet font-semibold">await</span> auth();
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[9px] text-text-secondary">
                            <span>Ownership Guard</span>
                            <span className="text-violet/80">Click copy</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Announcement Pill Badge */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Link
                    href="/register"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-700/60 bg-neutral-900/60 px-4 py-1.5 text-xs font-mono text-neutral-300 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-neutral-500 hover:-translate-y-0.5 dark:border-neutral-700/50"
                >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                    <span className="font-semibold text-text-primary">
                        CodeVault v1.0
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">Self-hostable snippet manager</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-text-secondary group-hover:text-text-primary" />
                </Link>
            </motion.div>

            {/* Main Headline with Kinetic Staggered Mask Entrance */}
            <div className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl md:text-7xl">
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="block"
                    >
                        Every fork remembers
                    </motion.h1>
                </div>
                <div className="overflow-hidden mt-1">
                    <motion.span
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ duration: 0.55, delay: 0.13, ease: [0.16, 1, 0.3, 1] }}
                        className="block bg-gradient-to-r from-sky-400 via-cobalt to-indigo-400 bg-clip-text text-transparent animate-shimmer"
                    >
                        where it came from.
                    </motion.span>
                </div>
            </div>

            {/* Subtitle */}
            <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="mt-5 max-w-2xl text-base md:text-lg text-text-secondary leading-relaxed"
            >
                Save reusable functions, trace fork lineage back to original authors,
                and search across languages and tags — all without leaving{" "}
                <kbd className="rounded-md border border-neutral-300 bg-bg-elevated px-2 py-0.5 text-xs font-mono font-semibold text-text-primary shadow-xs dark:border-neutral-700">
                    ⌘K
                </kbd>
                .
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="mt-7 flex flex-wrap items-center justify-center gap-4"
            >
                <Link
                    href="/register"
                    className="sheen-button group inline-flex items-center gap-2 rounded-full bg-cobalt px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cobalt/25 transition-all duration-200 hover:bg-cobalt-hover active:bg-cobalt-active hover:shadow-xl hover:shadow-cobalt/35 hover:-translate-y-0.5 active:scale-95"
                >
                    <span>Get started free</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                    href="/snippets"
                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-900/70 hover:bg-neutral-800/80 px-7 py-3.5 text-sm font-semibold text-text-primary shadow-sm backdrop-blur-md transition-all duration-200 hover:border-neutral-500 hover:-translate-y-0.5 active:scale-95"
                >
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Explore public snippets</span>
                </Link>
            </motion.div>

            {/* Feature Highlights Pills */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.38 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary"
            >
                <div className="group flex items-center gap-2 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_6px_#7C3AED]" />
                    <span className="group-hover:text-text-primary transition-colors">Fork lineage tracking</span>
                </div>
                <div className="group flex items-center gap-2 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <span className="h-1.5 w-1.5 rounded-full bg-cobalt shadow-[0_0_6px_#3B82F6]" />
                    <span className="group-hover:text-text-primary transition-colors">Multi-language search</span>
                </div>
                <div className="group flex items-center gap-2 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_6px_#10B981]" />
                    <span className="group-hover:text-text-primary transition-colors">On-demand AI explanation</span>
                </div>
            </motion.div>
        </div>
    );
}
