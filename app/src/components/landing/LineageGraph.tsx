"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitFork, Sparkles, User, ArrowUpRight, Code, ShieldCheck, Plus, X, Check, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";

interface LineageNode {
    id: string;
    title: string;
    author: string;
    language: string;
    langColor: string;
    forkDiff: string;
    isOrigin?: boolean;
    isSimulated?: boolean;
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

const DEFAULT_FORKS: LineageNode[] = [
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

const SIMULATION_PRESETS = [
    {
        title: "useAuthRustWasm.rs",
        language: "Rust",
        langColor: "#DEA584",
        forkDiff: "+ Compiled to ultra high-speed WebAssembly core",
        author: "You (Rustacean)",
    },
    {
        title: "useAuthGoRoutine.go",
        language: "Go",
        langColor: "#00ADD8",
        forkDiff: "+ Non-blocking worker pool with channels",
        author: "You (Go Engineer)",
    },
    {
        title: "useAuthElixirAgent.ex",
        language: "Elixir",
        langColor: "#6E4A7E",
        forkDiff: "+ Distributed GenServer state reconciliation",
        author: "You (OTP Alchemist)",
    },
];

export function LineageGraph() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [forkList, setForkList] = useState<LineageNode[]>(DEFAULT_FORKS);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
    const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
    const [customTitle, setCustomTitle] = useState("");
    const [customDiff, setCustomDiff] = useState("");
    const [hasSimulated, setHasSimulated] = useState(false);

    const handleOpenSimulator = () => {
        setIsSimulatorOpen(true);
    };

    const handleExecuteFork = () => {
        const preset = SIMULATION_PRESETS[selectedPresetIdx];
        const newFork: LineageNode = {
            id: `fork-simulated-${Date.now()}`,
            title: customTitle.trim() || preset.title,
            author: preset.author,
            language: preset.language,
            langColor: preset.langColor,
            forkDiff: customDiff.trim() || preset.forkDiff,
            isSimulated: true,
        };

        // Replace the center card with the new simulated node
        setForkList([DEFAULT_FORKS[0], newFork, DEFAULT_FORKS[2]]);
        setHasSimulated(true);
        setIsSimulatorOpen(false);
        setSelectedNode(newFork.id);
        toast.success(`✨ Created fork: ${newFork.title} linked to useAuth.ts!`);
    };

    const handleResetGraph = () => {
        setForkList(DEFAULT_FORKS);
        setHasSimulated(false);
        setSelectedNode(null);
        toast.info("Lineage graph reset to default.");
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({
            x: -y * 6,
            y: x * 8,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setHoveredNode(null);
    };

    return (
        <>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
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

                    <div className="flex items-center gap-2.5">
                        {hasSimulated ? (
                            <button
                                onClick={handleResetGraph}
                                className="inline-flex items-center gap-1.5 rounded-full bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-all shadow-xs"
                            >
                                <RefreshCw className="h-3 w-3" />
                                <span>Reset Graph</span>
                            </button>
                        ) : null}

                        <button
                            onClick={handleOpenSimulator}
                            className="sheen-button inline-flex items-center gap-1.5 rounded-full bg-violet px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet/25 hover:bg-violet-hover hover:scale-105 active:scale-95 transition-all"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Simulate Fork</span>
                        </button>
                    </div>
                </div>

                {/* Interactive Lineage Instruction Strip */}
                <div className="mt-4 rounded-2xl border border-violet/25 bg-gradient-to-r from-violet/[0.07] via-cobalt/[0.04] to-transparent p-3.5 text-xs text-text-secondary flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet/20 text-violet font-bold text-xs border border-violet/30 shadow-xs">
                            💡
                        </span>
                        <div className="space-y-0.5">
                            <span className="font-bold text-text-primary text-xs flex items-center gap-2">
                                How Fork Lineage Works
                                <span className="text-[10px] text-violet font-mono font-normal">Interactive Simulation</span>
                            </span>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                Click <strong>&quot;Simulate Fork&quot;</strong> above to spawn a custom mutation (e.g. Rust WASM or Go Routine) and watch CodeVault instantly connect a bidirectional ancestry link back to <strong className="text-violet">useAuth.ts (#root)</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-secondary bg-bg-surface/80 px-2.5 py-1.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800 shrink-0">
                        <span className="text-violet font-bold">1. Root</span> → <span className="text-cobalt font-bold">2. Fork</span> → <span className="text-emerald-400 font-bold">3. Diff Trace</span>
                    </div>
                </div>

                {/* Tree Container */}
                <div className="relative mt-8 flex flex-col items-center">
                    {/* 1. Origin Node with Entrance Animation & Hover State */}
                    <motion.div
                        variants={{
                            hidden: { scale: 0.98, y: 0 },
                            visible: { scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/20 px-2.5 py-0.5 text-[10px] font-bold text-violet border border-violet/30">
                                <Sparkles className="h-3 w-3 animate-spin text-violet" style={{ animationDuration: "8s" }} />
                                ORIGIN SNIPPET (#root)
                            </span>
                            <span className="rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-text-secondary">
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
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3 text-text-secondary" />
                                {ORIGIN_NODE.author}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-violet">
                                <GitFork className="h-3 w-3" />
                                3 Active Branches
                            </span>
                        </div>

                        {/* Origin Bottom Connector Dot */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-violet bg-bg-surface shadow-sm flex items-center justify-center z-20">
                            <div className="h-1.5 w-1.5 rounded-full bg-violet" />
                        </div>
                    </motion.div>

                    {/* 2. Precision Mathematical Connecting Branch Lines with non-scaling-stroke */}
                    <div className="relative h-14 w-full my-1 pointer-events-none hidden md:block">
                        <svg
                            className="absolute inset-0 h-full w-full overflow-visible"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            {/* Branch 1 (Left: 16.67%) - Wide Underlay Glow */}
                            {(hoveredNode === "fork-1" || hoveredNode === "origin") && (
                                <path
                                    d="M 50 0 C 50 50, 16.67 50, 16.67 100"
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                    stroke="#7C3AED"
                                    strokeWidth={7}
                                    strokeOpacity={0.4}
                                    className="transition-all duration-200"
                                />
                            )}
                            {/* Branch 1 Core Line */}
                            <path
                                d="M 50 0 C 50 50, 16.67 50, 16.67 100"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                stroke={
                                    hoveredNode === "fork-1"
                                        ? "#C4B5FD"
                                        : hoveredNode === "origin"
                                        ? "#A78BFA"
                                        : "#7C3AED"
                                }
                                strokeWidth={hoveredNode === "fork-1" || hoveredNode === "origin" ? 2.5 : 2}
                                strokeOpacity={
                                    hoveredNode === "fork-1" || hoveredNode === "origin"
                                        ? 1
                                        : hoveredNode
                                        ? 0.25
                                        : 0.7
                                }
                                className="transition-all duration-200"
                            />

                            {/* Branch 2 (Center: 50%) - Wide Underlay Glow */}
                            {(hasSimulated || hoveredNode === forkList[1]?.id || hoveredNode === "origin") && (
                                <path
                                    d="M 50 0 L 50 100"
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                    stroke={hasSimulated ? "#10B981" : "#7C3AED"}
                                    strokeWidth={7}
                                    strokeOpacity={hasSimulated ? 0.45 : 0.4}
                                    className="transition-all duration-200"
                                />
                            )}
                            {/* Branch 2 Core Line */}
                            <path
                                d="M 50 0 L 50 100"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                stroke={
                                    hasSimulated
                                        ? "#10B981"
                                        : hoveredNode === forkList[1]?.id
                                        ? "#C4B5FD"
                                        : hoveredNode === "origin"
                                        ? "#A78BFA"
                                        : "#7C3AED"
                                }
                                strokeWidth={
                                    hasSimulated || hoveredNode === forkList[1]?.id || hoveredNode === "origin"
                                        ? 2.5
                                        : 2
                                }
                                strokeOpacity={
                                    hasSimulated || hoveredNode === forkList[1]?.id || hoveredNode === "origin"
                                        ? 1
                                        : hoveredNode
                                        ? 0.25
                                        : 0.7
                                }
                                className="transition-all duration-200"
                            />

                            {/* Branch 3 (Right: 83.33%) - Wide Underlay Glow */}
                            {(hoveredNode === forkList[2]?.id || hoveredNode === "origin") && (
                                <path
                                    d="M 50 0 C 50 50, 83.33 50, 83.33 100"
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                    stroke="#7C3AED"
                                    strokeWidth={7}
                                    strokeOpacity={0.4}
                                    className="transition-all duration-200"
                                />
                            )}
                            {/* Branch 3 Core Line */}
                            <path
                                d="M 50 0 C 50 50, 83.33 50, 83.33 100"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                                stroke={
                                    hoveredNode === forkList[2]?.id
                                        ? "#C4B5FD"
                                        : hoveredNode === "origin"
                                        ? "#A78BFA"
                                        : "#7C3AED"
                                }
                                strokeWidth={hoveredNode === forkList[2]?.id || hoveredNode === "origin" ? 2.5 : 2}
                                strokeOpacity={
                                    hoveredNode === forkList[2]?.id || hoveredNode === "origin"
                                        ? 1
                                        : hoveredNode
                                        ? 0.25
                                        : 0.7
                                }
                                className="transition-all duration-200"
                            />
                        </svg>
                    </div>

                    {/* 3. Fork Nodes Row with Interactive Tooltips */}
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
                        {forkList.map((fork, idx) => (
                            <motion.div
                                key={fork.id}
                                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
                                onMouseEnter={() => setHoveredNode(fork.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onClick={() => setSelectedNode(fork.id)}
                                className={`group relative cursor-pointer rounded-2xl border bg-bg-surface p-4 transition-all duration-300 ${
                                    fork.isSimulated
                                        ? "border-emerald-500 shadow-xl shadow-emerald-500/20 bg-emerald-500/[0.04] ring-2 ring-emerald-500/40"
                                        : selectedNode === fork.id
                                        ? "border-violet shadow-xl shadow-violet/20 ring-2 ring-violet/30"
                                        : hoveredNode === fork.id
                                        ? "border-violet/80 bg-violet/[0.04] shadow-lg shadow-violet/15"
                                        : "border-neutral-200/80 hover:border-violet/60 dark:border-neutral-800 shadow-sm"
                                }`}
                            >
                                {/* Simulated Badge */}
                                {fork.isSimulated && (
                                    <span className="absolute -top-3 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                        ✨ LIVE FORK
                                    </span>
                                )}

                                {/* Lineage Node Connector Dot */}
                                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 bg-bg-surface shadow-sm flex items-center justify-center transition-all z-20 ${
                                    fork.isSimulated ? "border-emerald-500 scale-125 ring-2 ring-emerald-500/40" : "border-violet"
                                }`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${fork.isSimulated ? "bg-emerald-500" : "bg-violet"}`} />
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
                                        Linked to Core
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Interactive Fork Simulator Modal */}
            <AnimatePresence>
                {isSimulatorOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSimulatorOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200/80 bg-bg-surface p-6 shadow-2xl backdrop-blur-2xl dark:border-neutral-800/80 dark:bg-bg-surface/95 z-10"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/15 text-violet border border-violet/30 shadow-xs">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">
                                            Interactive Fork Simulator
                                        </h3>
                                        <p className="text-[11px] text-text-secondary">
                                            Spawn a mutation branch connected to useAuth.ts
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsSimulatorOpen(false)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Modal Body: Preset Selection */}
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-2">
                                        Select Template Preset:
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {SIMULATION_PRESETS.map((preset, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedPresetIdx(idx);
                                                    setCustomTitle(preset.title);
                                                    setCustomDiff(preset.forkDiff);
                                                }}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                                    selectedPresetIdx === idx
                                                        ? "border-violet bg-violet/10 text-text-primary shadow-xs"
                                                        : "border-neutral-200/60 dark:border-neutral-800 bg-bg-elevated/50 text-text-secondary hover:border-violet/40 hover:text-text-primary"
                                                }`}
                                            >
                                                <div>
                                                    <span className="text-xs font-bold font-mono text-text-primary block">
                                                        {preset.title}
                                                    </span>
                                                    <span className="text-[11px] text-text-secondary block mt-0.5">
                                                        {preset.forkDiff}
                                                    </span>
                                                </div>
                                                <span className="rounded-md bg-bg-surface px-2 py-0.5 text-[10px] font-bold text-violet border border-violet/20 font-mono">
                                                    {preset.language}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Simulation Workflow Guide */}
                                <div className="rounded-xl border border-violet/20 bg-violet/5 p-3 text-[11px] text-text-secondary space-y-1.5">
                                    <span className="font-bold text-violet flex items-center gap-1.5 text-xs">
                                        <GitFork className="h-3.5 w-3.5" />
                                        How CodeVault Provenance Works:
                                    </span>
                                    <ul className="space-y-1 text-[11px] list-disc list-inside">
                                        <li><strong>Parent Anchor:</strong> Fork branches from <code className="text-violet font-mono">useAuth.ts</code> (#root by CodeVault Core).</li>
                                        <li><strong>Immutable Attribution:</strong> Your mutation diff is tracked while preserving root author credit.</li>
                                        <li><strong>Real-time Graph:</strong> The visual tree updates instantly with a glowing connecting laser beam.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setIsSimulatorOpen(false)}
                                    className="rounded-full px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteFork}
                                    className="sheen-button inline-flex items-center gap-1.5 rounded-full bg-violet px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet/25 hover:bg-violet-hover active:scale-95 transition-all"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Execute & Trace Lineage</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
