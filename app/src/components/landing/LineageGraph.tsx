"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Sparkles, User, ArrowUpRight, Code, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface LineageNode {
    id: string;
    title: string;
    author: string;
    language: string;
    langColor: string;
    forkDiff: string;
    isOrigin?: boolean;
}

const ORIGIN_NODE: LineageNode = {
    id: "origin-1",
    title: "useAuth.ts (Original)",
    author: "CodeVault Core",
    language: "TypeScript",
    langColor: "#3178C6",
    forkDiff: "Base JWT auth implementation",
    isOrigin: true,
};

const FORK_NODES: LineageNode[] = [
    {
        id: "fork-1",
        title: "useAuthWithSession.ts",
        author: "CodeVault Team",
        language: "TypeScript",
        langColor: "#3178C6",
        forkDiff: "+ Redis session sync & auto-refresh",
    },
    {
        id: "fork-2",
        title: "useAuthRBACGuard.ts",
        author: "CodeVault Team",
        language: "TypeScript",
        langColor: "#3178C6",
        forkDiff: "+ Role-based access permission matrix",
    },
    {
        id: "fork-3",
        title: "useAuthFastAPIBridge.py",
        author: "CodeVault Team",
        language: "Python",
        langColor: "#3776AB",
        forkDiff: "Ported algorithm to Async FastAPI",
    },
];

export function LineageGraph() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    return (
        <div className="relative mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-neutral-200/80 bg-white/70 p-6 md:p-8 shadow-xl backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60">
            {/* Header / Lineage Thesis Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                        <GitFork className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                                Provenance & Fork Lineage Graph
                            </h3>
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                --cv-lineage
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Every fork visibly traces back to its original author and source.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Realtime Lineage Thread</span>
                </div>
            </div>

            {/* Tree Container */}
            <div className="relative mt-8 flex flex-col items-center">
                {/* 1. Origin Node */}
                <motion.div
                    initial={{ scale: 0.96, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 w-full max-w-sm rounded-2xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-500/10 via-white to-white p-4 shadow-lg dark:from-amber-950/40 dark:via-neutral-900 dark:to-neutral-900 dark:border-amber-500/50"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                Origin Source
                            </span>
                        </div>
                        <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-600 dark:text-neutral-300">
                            {ORIGIN_NODE.language}
                        </span>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-neutral-900 dark:text-white">
                        {ORIGIN_NODE.title}
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {ORIGIN_NODE.forkDiff}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-2 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-300">
                            <User className="h-3 w-3 text-amber-500" />
                            {ORIGIN_NODE.author}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            3 Active Lineages
                        </span>
                    </div>
                </motion.div>

                {/* 2. SVG Animated Lineage Threads (Amber Draw-In) */}
                <div className="relative w-full h-20 md:h-24 my-1">
                    <svg
                        className="w-full h-full overflow-visible pointer-events-none"
                        viewBox="0 0 800 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="lineageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#E0A458" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#E0A458" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>

                        {/* Branch to Fork 1 (Left) */}
                        <motion.path
                            d="M 400 0 C 400 50, 160 50, 160 100"
                            fill="none"
                            stroke="url(#lineageGlow)"
                            strokeWidth="2.5"
                            strokeDasharray="4 2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                        />

                        {/* Branch to Fork 2 (Center) */}
                        <motion.path
                            d="M 400 0 L 400 100"
                            fill="none"
                            stroke="#E0A458"
                            strokeWidth="2.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
                        />

                        {/* Branch to Fork 3 (Right) */}
                        <motion.path
                            d="M 400 0 C 400 50, 640 50, 640 100"
                            fill="none"
                            stroke="url(#lineageGlow)"
                            strokeWidth="2.5"
                            strokeDasharray="4 2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        />
                    </svg>
                </div>

                {/* 3. Fork Nodes Row */}
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
                    {FORK_NODES.map((fork, idx) => (
                        <motion.div
                            key={fork.id}
                            initial={{ y: 15 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            onClick={() => setSelectedNode(fork.id)}
                            className={`group relative cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-300 dark:bg-neutral-900 ${
                                selectedNode === fork.id
                                    ? "border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20"
                                    : "border-neutral-200/80 hover:border-amber-400/60 dark:border-neutral-800 dark:hover:border-amber-500/40 shadow-sm hover:shadow-md"
                            }`}
                        >
                            {/* Lineage Node Connector Dot */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    <GitFork className="h-3 w-3" />
                                    Fork #{idx + 1}
                                </span>
                                <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                                    {fork.language}
                                </span>
                            </div>

                            <h5 className="mt-2 text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                                {fork.title}
                            </h5>

                            <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                {fork.forkDiff}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-2 text-[11px] text-neutral-400">
                                <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                                    <User className="h-3 w-3 text-neutral-400" />
                                    {fork.author}
                                </span>
                                <span className="text-[10px] font-medium text-amber-600/80 dark:text-amber-400/80">
                                    Linked to CodeVault Core
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
