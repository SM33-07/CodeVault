"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    GitFork,
    Search,
    Sparkles,
    FolderKanban,
    Zap,
    Shield,
    Layers,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    Tag as TagIcon,
    Terminal,
} from "lucide-react";

export function FeatureBentoGrid() {
    // View Mode: 'grid' (2x2 symmetrical aligned grid) or 'stack' (3D morphing card stack)
    const [viewMode, setViewMode] = useState<"grid" | "stack">("grid");
    const [activeStackIndex, setActiveStackIndex] = useState(0);

    // Feature 1: Lineage State
    const [activeRevision, setActiveRevision] = useState<"v1" | "v2" | "v3">("v3");

    // Feature 2: Search State
    const [searchQuery, setSearchQuery] = useState("jwt");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Feature 3: AI Explanation State
    const [isExplaining, setIsExplaining] = useState(false);
    const [aiProgress, setAiProgress] = useState(100);

    // Feature 4: Tag Taxonomy State
    const [selectedTags, setSelectedTags] = useState<string[]>(["#react", "#performance"]);

    // Command Palette Mock Items
    const searchResults = [
        { id: "1", title: "FastAPI JWT & Token-Bucket Guard", tag: "#jwt", lang: "Python" },
        { id: "2", title: "Go JWT Authentication Middleware", tag: "#jwt", lang: "Go" },
        { id: "3", title: "Tokio Async Worker Pool", tag: "#concurrency", lang: "Rust" },
        { id: "4", title: "useDebounce & useThrottle Hook", tag: "#react", lang: "TypeScript" },
    ].filter((item) =>
        searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.tag.includes(searchQuery.toLowerCase()) : true
    );

    const triggerAiExplanation = () => {
        setIsExplaining(true);
        setAiProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 25;
            setAiProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsExplaining(false);
            }
        }, 140);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const nextStackCard = () => {
        setActiveStackIndex((prev) => (prev + 1) % 4);
    };

    const prevStackCard = () => {
        setActiveStackIndex((prev) => (prev - 1 + 4) % 4);
    };

    // Array of the 4 Feature Card Definitions
    const featureCards = [
        {
            id: "lineage",
            title: "Fork Lineage Tracking",
            subtitle: "Interactive revision provenance graph",
            badge: "Provenance",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
            icon: <GitFork className="h-5 w-5 text-amber-500" />,
            iconBg: "bg-amber-500/10 border-amber-500/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Node Selector */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: "v1", label: "1. Origin (v1.0)", author: "Core Lead" },
                            { id: "v2", label: "2. Team (+Redis)", author: "Ops Team" },
                            { id: "v3", label: "3. Active (+Safe)", author: "You (Active)" },
                        ].map((rev) => (
                            <button
                                key={rev.id}
                                onClick={() => setActiveRevision(rev.id as any)}
                                className={`rounded-xl p-2 text-left border transition-all text-xs ${
                                    activeRevision === rev.id
                                        ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 shadow-xs font-bold"
                                        : "border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400"
                                }`}
                            >
                                <p className="truncate text-[11px]">{rev.label}</p>
                                <p className="text-[10px] text-neutral-400 truncate">{rev.author}</p>
                            </button>
                        ))}
                    </div>

                    {/* Diff viewer */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3.5 font-mono text-xs text-neutral-300 shadow-inner h-[135px] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-[10px] text-neutral-500">
                            <span>useDebounce.ts ({activeRevision.toUpperCase()})</span>
                            <span className="text-amber-400">Parent: #snip-core-1</span>
                        </div>

                        {activeRevision === "v1" && (
                            <div className="space-y-1 text-neutral-400 text-[11px]">
                                <div><span className="text-neutral-600 select-none">1 </span>export function useDebounce(value, delay) &#123;</div>
                                <div><span className="text-neutral-600 select-none">2 </span>  const [debounced, setDebounced] = useState(value);</div>
                                <div><span className="text-neutral-600 select-none">3 </span>  useEffect(() =&gt; setTimeout(setDebounced, delay));</div>
                                <div><span className="text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}

                        {activeRevision === "v2" && (
                            <div className="space-y-1 text-[11px]">
                                <div className="text-neutral-400"><span className="text-neutral-600 select-none">1 </span>export function useDebounce&lt;T&gt;(value: T, delay = 300): T &#123;</div>
                                <div className="text-emerald-400 bg-emerald-950/40"><span className="text-emerald-500 select-none">+ </span>  const [debounced, setDebounced] = useState&lt;T&gt;(value);</div>
                                <div className="text-emerald-400 bg-emerald-950/40"><span className="text-emerald-500 select-none">+ </span>  const timer = setTimeout(() =&gt; setDebounced(value), delay);</div>
                                <div className="text-neutral-400"><span className="text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}

                        {activeRevision === "v3" && (
                            <div className="space-y-1 text-[11px]">
                                <div className="text-neutral-400"><span className="text-neutral-600 select-none">1 </span>export function useDebounce&lt;T&gt;(value: T, delay = 300): T &#123;</div>
                                <div className="text-neutral-400"><span className="text-neutral-600 select-none">2 </span>  const [debounced, setDebounced] = useState&lt;T&gt;(value);</div>
                                <div className="text-emerald-400 bg-emerald-950/40"><span className="text-emerald-500 select-none">+ </span>  useEffect(() =&gt; &#123; const t = setTimeout(...); return () =&gt; clearTimeout(t); &#125;);</div>
                                <div className="text-neutral-400"><span className="text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                        <span>Maintains complete fork ancestry</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">3 Revisions</span>
                    </div>
                </div>
            ),
        },
        {
            id: "search",
            title: "Lightning Ctrl+K & ⌘K Search",
            subtitle: "Fuzzy-indexed keyboard query engine",
            badge: "Speed",
            badgeColor: "bg-teal-50 text-teal-700 border-teal-200/60 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60",
            icon: <Search className="h-5 w-5 text-teal-500" />,
            iconBg: "bg-teal-500/10 border-teal-500/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Search Input Box */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search (e.g. jwt, rust, #react)..."
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs text-neutral-900 outline-none focus:border-teal-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                        />
                    </div>

                    {/* Filtered Results */}
                    <div className="space-y-1.5 h-[135px] overflow-y-auto">
                        {searchResults.slice(0, 3).map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedIndex(idx)}
                                className={`flex items-center justify-between rounded-xl p-2 text-xs cursor-pointer transition-all ${
                                    selectedIndex === idx
                                        ? "bg-teal-50 text-teal-900 border border-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-800"
                                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300"
                                }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className="rounded-md bg-neutral-200/70 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono">
                                        {item.lang}
                                    </span>
                                    <span className="truncate font-medium text-[11px]">{item.title}</span>
                                </div>
                                <span className="text-[10px] text-teal-600 dark:text-teal-400 shrink-0 font-medium">
                                    {item.tag}
                                </span>
                            </div>
                        ))}
                        {searchResults.length === 0 && (
                            <p className="text-center text-xs text-neutral-400 py-6">No matching snippets</p>
                        )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                        <span>Navigate with ↑ ↓ keys</span>
                        <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            ↵ Enter
                        </kbd>
                    </div>
                </div>
            ),
        },
        {
            id: "ai",
            title: "AI-Assisted Explanation",
            subtitle: "On-demand analysis with graceful fallback",
            badge: "Intelligence",
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60",
            icon: <Sparkles className="h-5 w-5 text-purple-500" />,
            iconBg: "bg-purple-500/10 border-purple-500/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    <button
                        onClick={triggerAiExplanation}
                        disabled={isExplaining}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-75"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>{isExplaining ? "Analyzing Architecture..." : "Explain Snippet Live"}</span>
                    </button>

                    <div className="rounded-2xl border border-purple-200/60 bg-purple-50/40 p-3.5 text-xs dark:border-purple-900/50 dark:bg-purple-950/20 h-[135px] overflow-y-auto">
                        {aiProgress < 100 ? (
                            <div className="space-y-3 py-3">
                                <div className="h-2 w-full bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 transition-all duration-150"
                                        style={{ width: `${aiProgress}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-center text-purple-700 dark:text-purple-300 font-medium">Parsing AST & complexity profile...</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-purple-700 dark:text-purple-300">
                                    <span>Complexity Profile</span>
                                    <span className="font-mono">Time: O(1) | Space: O(1)</span>
                                </div>
                                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Encapsulates timer teardown on dependency shift to prevent unmounted memory leaks.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
                        <span className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3 text-emerald-500" />
                            <span>Offline resilience</span>
                        </span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">Gemini Flash</span>
                    </div>
                </div>
            ),
        },
        {
            id: "taxonomy",
            title: "Many-to-Many Tag Taxonomy",
            subtitle: "Cross-index snippets by domains & patterns",
            badge: "Organization",
            badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60",
            icon: <FolderKanban className="h-5 w-5 text-cyan-500" />,
            iconBg: "bg-cyan-500/10 border-cyan-500/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Tag Cloud */}
                    <div className="flex flex-wrap gap-1.5 h-[135px] overflow-y-auto content-start">
                        {[
                            "#react",
                            "#hooks",
                            "#performance",
                            "#fastapi",
                            "#jwt",
                            "#redis",
                            "#tokio",
                            "#rust",
                            "#postgres",
                            "#sql",
                            "#docker",
                            "#microservices",
                        ].map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        isSelected
                                            ? "bg-cyan-600 text-white shadow-xs scale-105"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="truncate">
                            Active: <strong className="text-neutral-800 dark:text-neutral-200">{selectedTags.join(", ") || "None"}</strong>
                        </span>
                        <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300 shrink-0">
                            {selectedTags.length * 3} matched
                        </span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className="mx-auto max-w-6xl px-4 py-20">
            {/* Section Header with Morphing View Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300">
                        <Zap className="h-3.5 w-3.5" />
                        <span>Engineered for Developer Productivity</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        Everything you need to master your snippet workflow
                    </h2>
                    <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl">
                        No more lost gists, buried Slack messages, or forgotten browser tabs.
                    </p>
                </div>

                {/* View Mode Switcher Tabs */}
                <div className="flex items-center gap-1 self-start md:self-auto rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900/80 backdrop-blur-md">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            viewMode === "grid"
                                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        }`}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        <span>Grid View</span>
                    </button>

                    <button
                        onClick={() => setViewMode("stack")}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            viewMode === "stack"
                                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        }`}
                    >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Morphing Stack</span>
                    </button>
                </div>
            </div>

            {/* Layout Container */}
            <LayoutGroup id="features-layout">
                {viewMode === "grid" ? (
                    /* 1. Symmetrical 2x2 Balanced Grid View */
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                    >
                        {featureCards.map((card) => (
                            <motion.div
                                key={card.id}
                                layout
                                layoutId={`feature-card-${card.id}`}
                                className="group flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/70"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.iconBg}`}>
                                                {card.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {card.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${card.badgeColor}`}>
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Micro-Widget Content */}
                                    <div className="my-2">
                                        {card.renderContent()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* 2. 3D Morphing Card Stack View */
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative flex flex-col items-center justify-center py-6 min-h-[460px]"
                    >
                        <div className="relative w-full max-w-xl h-[420px] flex items-center justify-center [perspective:1000px]">
                            {featureCards.map((card, index) => {
                                const offset = (index - activeStackIndex + 4) % 4;
                                const isTop = offset === 0;

                                // Stack position math: cards behind scale down, shift up, and fade slightly
                                const scale = 1 - offset * 0.05;
                                const y = offset * 16;
                                const zIndex = 10 - offset;
                                const opacity = Math.max(0.3, 1 - offset * 0.25);
                                const rotate = (offset % 2 === 0 ? 1 : -1) * offset * 1.5;

                                return (
                                    <motion.div
                                        key={card.id}
                                        layout
                                        layoutId={`feature-card-${card.id}`}
                                        onClick={() => setActiveStackIndex(index)}
                                        animate={{
                                            scale,
                                            y,
                                            rotate,
                                            zIndex,
                                            opacity,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 280,
                                            damping: 26,
                                        }}
                                        className={`absolute w-full rounded-3xl border p-6 sm:p-7 shadow-2xl transition-shadow cursor-pointer ${
                                            isTop
                                                ? "border-indigo-500/80 bg-white/95 dark:bg-neutral-900/95 ring-2 ring-indigo-500/20"
                                                : "border-neutral-200/70 bg-white/80 dark:border-neutral-800/70 dark:bg-neutral-900/80"
                                        }`}
                                        style={{
                                            backdropFilter: "blur(12px)",
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.iconBg}`}>
                                                    {card.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                                        {card.title}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {card.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${card.badgeColor}`}>
                                                {card.badge}
                                            </span>
                                        </div>

                                        <div className="my-2">
                                            {card.renderContent()}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Stack Navigation Controls */}
                        <div className="flex items-center justify-between w-full max-w-sm mt-8">
                            <button
                                onClick={prevStackCard}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-100 hover:scale-105 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                aria-label="Previous feature"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                {featureCards.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStackIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            idx === activeStackIndex
                                                ? "w-7 bg-indigo-600 shadow-xs shadow-indigo-500/50"
                                                : "w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                        }`}
                                        aria-label={`Go to feature ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextStackCard}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-100 hover:scale-105 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                aria-label="Next feature"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </LayoutGroup>
        </section>
    );
}
