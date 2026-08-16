"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [forkList, setForkList] = useState<LineageNode[]>(FORK_NODES);
    const [simulated, setSimulated] = useState<boolean>(false);

    const handleSimulateFork = () => {
        if (!simulated) {
            const newFork: LineageNode = {
                id: "fork-simulated",
                title: "useAuthRustWasm.rs",
                author: "You (Simulated)",
                language: "Rust",
                langColor: "#DEA584",
                forkDiff: "+ Compiled to high-speed WebAssembly core",
            };
            setForkList([FORK_NODES[0], newFork, FORK_NODES[2]]);
            setSimulated(true);
        } else {
            setForkList(FORK_NODES);
            setSimulated(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({
            x: -y * 8,
            y: x * 10,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setHoveredNode(null);
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.25s ease-out, box-shadow 0.3s ease-out",
            }}
            className="relative mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-neutral-200/80 bg-bg-surface/85 p-6 md:p-8 shadow-xl backdrop-blur-xl dark:border-neutral-800/80 hover:shadow-2xl hover:shadow-violet/20 hover:border-violet/40"
        >
            {/* Header / Lineage Thesis Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/15 text-violet border border-violet/30 shadow-xs">
                        <GitFork className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-text-primary">
                                Provenance & Fork Lineage Graph
                            </h3>
                            <span className="rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-semibold text-violet border border-violet/20">
                                Signature Provenance
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                            Every fork visibly traces back to its original author and source.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSimulateFork}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all shadow-xs ${
                            simulated
                                ? "bg-violet text-white shadow-violet/30"
                                : "bg-violet/10 text-violet hover:bg-violet/20 border border-violet/30"
                        }`}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{simulated ? "Reset Graph" : "Simulate Fork"}</span>
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-secondary">
                        <span className="flex h-2 w-2 rounded-full bg-mint animate-pulse" />
                        <span className="text-mint font-semibold">Realtime Lineage</span>
                    </div>
                </div>
            </div>

            {/* Tree Container */}
            <div className="relative mt-8 flex flex-col items-center">
                {/* 1. Origin Node with Entrance Animation & Hover State */}
                <motion.div
                    variants={{
                        hidden: { scale: 0.92, y: -15, opacity: 0 },
                        visible: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
                    }}
                    onMouseEnter={() => setHoveredNode("origin")}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`relative z-10 w-full max-w-sm rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br from-violet/15 via-bg-surface to-bg-surface p-4 shadow-lg ${
                        hoveredNode === "origin"
                            ? "border-violet bg-violet/20 shadow-violet/25 scale-[1.02]"
                            : "border-violet/70 shadow-violet/10"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-violet animate-ping" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-violet">
                                Origin Source Root
                            </span>
                        </div>
                        <span className="rounded-md bg-bg-elevated px-2 py-0.5 text-[10px] font-mono font-medium text-text-secondary">
                            {ORIGIN_NODE.language}
                        </span>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-text-primary">
                        {ORIGIN_NODE.title}
                    </h4>
                    <p className="mt-1 text-xs text-text-secondary">
                        {ORIGIN_NODE.forkDiff}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800 pt-2 text-[11px] text-text-secondary">
                        <span className="flex items-center gap-1 font-medium text-text-primary">
                            <User className="h-3 w-3 text-violet" />
                            {ORIGIN_NODE.author}
                        </span>
                        <motion.span
                            animate={{ opacity: [1, 0.55, 1] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                            className="text-violet font-semibold"
                        >
                            3 Active Lineages
                        </motion.span>
                    </div>

                    {/* Origin Bottom Connector Dot */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-violet bg-bg-surface shadow-md shadow-violet/30 flex items-center justify-center z-20">
                        <div className="h-1.5 w-1.5 rounded-full bg-violet" />
                    </div>
                </motion.div>

                {/* 2. SVG Animated Lineage Threads Perfectly Aligned to Column Centers */}
                <div className="relative w-full h-20 md:h-24 my-1 hidden md:block">
                    <svg
                        className="w-full h-full overflow-visible pointer-events-none"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="lineageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
                            </linearGradient>
                            <linearGradient id="lineageActiveGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#C4B5FD" stopOpacity="1" />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
                            </linearGradient>
                        </defs>

                        {/* Branch to Fork 1 (Left Card: 16%) */}
                        <motion.path
                            d="M 50 0 C 50 45, 16 55, 16 100"
                            fill="none"
                            stroke={hoveredNode === "fork-1" ? "url(#lineageActiveGlow)" : "url(#lineageGlow)"}
                            strokeWidth={hoveredNode === "fork-1" ? "3.5" : "2"}
                            strokeDasharray={hoveredNode === "fork-1" ? "none" : "4 2"}
                            variants={{
                                hidden: { pathLength: 0, opacity: 0 },
                                visible: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: "easeOut", delay: 0.3 } },
                            }}
                        />

                        {/* Branch to Fork 2 (Center Card: 50%) */}
                        <motion.path
                            d="M 50 0 L 50 100"
                            fill="none"
                            stroke={hoveredNode === "fork-2" ? "#A78BFA" : "#7C3AED"}
                            strokeWidth={hoveredNode === "fork-2" ? "3.5" : "2"}
                            variants={{
                                hidden: { pathLength: 0, opacity: 0 },
                                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: "easeOut", delay: 0.45 } },
                            }}
                        />

                        {/* Branch to Fork 3 (Right Card: 84%) */}
                        <motion.path
                            d="M 50 0 C 50 45, 84 55, 84 100"
                            fill="none"
                            stroke={hoveredNode === "fork-3" ? "url(#lineageActiveGlow)" : "url(#lineageGlow)"}
                            strokeWidth={hoveredNode === "fork-3" ? "3.5" : "2"}
                            strokeDasharray={hoveredNode === "fork-3" ? "none" : "4 2"}
                            variants={{
                                hidden: { pathLength: 0, opacity: 0 },
                                visible: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: "easeOut", delay: 0.6 } },
                            }}
                        />
                    </svg>
                </div>

                {/* 3. Fork Nodes Row with Overshoot Spring Entrance & Interactive Tooltips */}
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
                    {forkList.map((fork, idx) => (
                        <motion.div
                            key={fork.id}
                            variants={{
                                hidden: { y: 30, opacity: 0, scale: 0.92 },
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 280,
                                        damping: 20,
                                        delay: 0.9 + idx * 0.14,
                                    },
                                },
                            }}
                            whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                            onMouseEnter={() => setHoveredNode(fork.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => setSelectedNode(fork.id)}
                            className={`group relative cursor-pointer rounded-2xl border bg-bg-surface p-4 transition-all duration-300 ${
                                selectedNode === fork.id
                                    ? "border-violet shadow-xl shadow-violet/20 ring-2 ring-violet/30"
                                    : hoveredNode === fork.id
                                    ? "border-violet/80 bg-violet/[0.04] shadow-lg shadow-violet/15"
                                    : "border-neutral-200/80 hover:border-violet/60 dark:border-neutral-800 shadow-sm"
                            }`}
                        >
                            {/* Interactive Tooltip Popover */}
                            <AnimatePresence>
                                {hoveredNode === fork.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xl border border-violet/40 dark:bg-neutral-800"
                                    >
                                        <span>Inspect {fork.forkDiff}</span>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Lineage Node Connector Dot */}
                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 bg-bg-surface shadow-sm flex items-center justify-center transition-all z-20 ${
                                hoveredNode === fork.id ? "border-violet scale-125 ring-2 ring-violet/40" : "border-violet"
                            }`}>
                                <div className="h-1.5 w-1.5 rounded-full bg-violet" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet">
                                    <GitFork className="h-3 w-3 text-violet" />
                                    Fork #{idx + 1}
                                </span>
                                <span className="rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
                                    {fork.language}
                                </span>
                            </div>

                            <h5 className="mt-2 text-xs font-bold text-text-primary line-clamp-1 group-hover:text-violet transition-colors">
                                {fork.title}
                            </h5>

                            <p className="mt-1 text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                                {fork.forkDiff}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800 pt-2 text-[11px] text-text-secondary">
                                <span className="flex items-center gap-1 text-text-secondary">
                                    <User className="h-3 w-3 text-text-secondary" />
                                    {fork.author}
                                </span>
                                <span className="text-[10px] font-medium text-violet">
                                    Linked to CodeVault Core
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
