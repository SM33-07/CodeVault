"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    CheckCircle2,
    XCircle,
    GitFork,
    Search,
    Shield,
    Bot,
    ArrowRight,
    Code2,
    FileText,
    MessageSquare,
    Zap,
    Lock,
} from "lucide-react";

export function ChaosVsVaultComparison() {
    const [viewMode, setViewMode] = useState<"side-by-side" | "vault-focus">("side-by-side");

    return (
        <section className="relative w-full px-4 py-16 md:py-24 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-bg-base">
            <div className="mx-auto max-w-6xl space-y-12">
                {/* Header */}
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cobalt/30 bg-cobalt/10 px-3.5 py-1 text-xs font-semibold text-cobalt">
                        <Zap className="h-3.5 w-3.5" />
                        <span>The Pain vs The Solution</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
                        Stop Losing Your Best Code. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-cobalt via-violet to-mint bg-clip-text text-transparent">
                            Start Curating With Provenance.
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        Slack threads disappear in 90 days. Gists lack search structure. Sticky notes get lost. CodeVault turns your engineering team's scattered knowledge into an indexed, permanent asset.
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* 1. The Chaos (Before) */}
                    <div className="relative flex flex-col justify-between rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/[0.03] to-bg-surface/50 p-6 md:p-8 shadow-lg backdrop-blur-xl dark:border-red-500/20 dark:bg-bg-surface/40">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-red-500/15">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                                        <XCircle className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">
                                            The Scattered Chaos
                                        </h3>
                                        <span className="text-[11px] text-red-400 font-mono">
                                            Without CodeVault
                                        </span>
                                    </div>
                                </div>
                                <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
                                    High Friction
                                </span>
                            </div>

                            {/* Pain Point Mockups */}
                            <div className="space-y-3">
                                {/* Slack Message Mockup */}
                                <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-bg-base/70 p-3.5 space-y-2 opacity-80">
                                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                                        <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                                            <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                                            #dev-backend (3 months ago)
                                        </span>
                                        <span className="text-red-400 text-[10px]">⚠️ Message expired</span>
                                    </div>
                                    <p className="text-xs text-text-secondary font-mono bg-bg-surface/60 p-2 rounded-lg line-clamp-2">
                                        &quot;hey anyone remember that JWT refresh token helper Alex wrote in April? need it for billing&quot;
                                    </p>
                                </div>

                                {/* Untitled text file */}
                                <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-bg-base/70 p-3.5 space-y-2 opacity-80">
                                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                                        <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                                            <FileText className="h-3.5 w-3.5 text-neutral-400" />
                                            notes_jwt_final_v3_copy.txt
                                        </span>
                                        <span className="text-neutral-400 text-[10px]">No syntax coloring</span>
                                    </div>
                                    <p className="text-xs text-text-secondary font-mono bg-bg-surface/60 p-2 rounded-lg line-clamp-1">
                                        function verify(t, s) &#123; /* broken snippet with zero comments */ &#125;
                                    </p>
                                </div>
                            </div>

                            {/* Pain List */}
                            <ul className="space-y-2.5 pt-2 text-xs text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                    <span>Lost author context and zero lineage tracking when snippets get modified.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                    <span>No fuzzy search — engineers waste 20+ minutes re-writing code already solved.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                    <span>Public clouds indexing your proprietary functions into public AI training sets.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-red-400 font-medium">
                            <span>Estimated loss: ~3.5 hrs/week per engineer</span>
                        </div>
                    </div>

                    {/* 2. The Sovereign Vault (After - CodeVault) */}
                    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-cobalt/60 bg-gradient-to-b from-cobalt/[0.08] via-bg-surface to-bg-surface p-6 md:p-8 shadow-2xl shadow-cobalt/15 backdrop-blur-xl dark:border-cobalt/50 dark:bg-bg-surface/80">
                        {/* Glow accent */}
                        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet/20 blur-3xl pointer-events-none" />

                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-cobalt/20">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cobalt/20 text-cobalt border border-cobalt/40 shadow-xs">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">
                                            The Sovereign CodeVault
                                        </h3>
                                        <span className="text-[11px] text-cobalt font-mono">
                                            Self-Hostable • 100% Provenance
                                        </span>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/30">
                                    Zero Telemetry
                                </span>
                            </div>

                            {/* Solved Mockup */}
                            <div className="rounded-2xl border border-cobalt/30 bg-bg-base/90 p-4 space-y-3 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="font-mono text-xs font-bold text-text-primary">
                                            useAuthWithSession.ts
                                        </span>
                                        <span className="rounded bg-violet/15 px-1.5 py-0.5 text-[9px] font-bold text-violet">
                                            Fork #1 of useAuth.ts
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-cobalt">&lt; 50ms Search</span>
                                </div>

                                <div className="rounded-xl bg-bg-surface/80 p-2.5 font-mono text-[11px] border border-neutral-700/40 text-text-secondary">
                                    <span className="text-cobalt font-semibold">export const</span> useAuth = () =&gt; &#123;{" "}
                                    <span className="text-emerald-400 font-semibold">// Redis session sync</span>{" "}
                                    &#125;;
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-text-secondary pt-1">
                                    <span className="flex items-center gap-1 text-violet font-semibold">
                                        <GitFork className="h-3 w-3" />
                                        Full Ancestry Graph
                                    </span>
                                    <span className="text-emerald-400 font-medium">✓ AI Explain Ready</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-2.5 pt-2 text-xs text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-text-primary">100% Fork Lineage</strong> — every snippet remembers its original root author and mutation diffs.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-text-primary">Sub-50ms Fuzzy Query</strong> — instant keyboard-driven search by tags, language, and keyword.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-text-primary">Air-Gapped Privacy</strong> — one-command self-hosted Docker container with zero third-party telemetry.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                            <span>1-Command Quickstart: docker compose up -d</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
