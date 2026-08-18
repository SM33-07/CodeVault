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
} from "lucide-react";
import { LaserBorderCard } from "@/components/ui/LaserBorderCard";

export function FeatureBentoGrid() {
    // View Mode: 'stack' (3D morphing card stack by default) or 'grid' (symmetrical 2x2 grid)
    const [viewMode, setViewMode] = useState<"grid" | "stack">("stack");
    const [activeStackIndex, setActiveStackIndex] = useState(0);

    // Feature 1: Lineage State
    const [activeRevision, setActiveRevision] = useState<"v1" | "v2" | "v3">("v3");

    // Feature 2: Search State & Auto-cycling
    const [searchQuery, setSearchQuery] = useState("jwt");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Feature 3: AI Explanation State
    const [isExplaining, setIsExplaining] = useState(false);
    const [aiProgress, setAiProgress] = useState(100);

    // Feature 4: Tag Taxonomy State
    const [selectedTags, setSelectedTags] = useState<string[]>(["#react", "#performance"]);

    // Auto-cycle demo search queries when not focused
    React.useEffect(() => {
        if (isSearchFocused) return;
        const demoQueries = ["jwt", "tokio", "useDebounce", "FastAPI"];
        let qIdx = 0;
        const interval = setInterval(() => {
            qIdx = (qIdx + 1) % demoQueries.length;
            setSearchQuery(demoQueries[qIdx]);
        }, 4000);
        return () => clearInterval(interval);
    }, [isSearchFocused]);

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
            progress += 20;
            setAiProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsExplaining(false);
            }
        }, 120);
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

    // 4 Feature Cards
    const featureCards = [
        {
            id: "lineage",
            title: "Fork Lineage Tracking",
            subtitle: "Interactive revision provenance graph",
            badge: "Provenance",
            badgeColor: "bg-violet/10 text-violet border-violet/20",
            icon: <GitFork className="h-5 w-5 text-violet" />,
            iconBg: "bg-violet/10 border-violet/20",
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
                                className={`rounded-xl p-2 text-left border transition-all text-xs ${activeRevision === rev.id
                                    ? "border-violet bg-violet/15 text-violet shadow-xs font-bold"
                                    : "border-neutral-200 bg-bg-surface hover:bg-bg-elevated dark:border-neutral-800 text-text-secondary"
                                    }`}
                            >
                                <p className="truncate text-[11px]">{rev.label}</p>
                                <p className="text-[10px] text-text-secondary truncate">{rev.author}</p>
                            </button>
                        ))}
                    </div>

                    {/* Diff viewer with highlight-flash on revision switch */}
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-bg-base p-3.5 font-mono text-xs text-text-primary shadow-inner h-[135px] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-text-secondary">
                            <span>useDebounce.ts ({activeRevision.toUpperCase()})</span>
                            <span className="text-violet">Parent: #snip-core-1</span>
                        </div>

                        {activeRevision === "v1" && (
                            <div className="space-y-1 text-text-secondary text-[11px]">
                                <div><span className="text-neutral-400 dark:text-neutral-600 select-none">1 </span>export function useDebounce(value, delay) &#123;</div>
                                <div><span className="text-neutral-400 dark:text-neutral-600 select-none">2 </span>  const [debounced, setDebounced] = useState(value);</div>
                                <div><span className="text-neutral-400 dark:text-neutral-600 select-none">3 </span>  useEffect(() =&gt; setTimeout(setDebounced, delay));</div>
                                <div><span className="text-neutral-400 dark:text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}

                        {activeRevision === "v2" && (
                            <div className="space-y-1 text-[11px]">
                                <div className="text-text-secondary"><span className="text-neutral-400 dark:text-neutral-600 select-none">1 </span>export function useDebounce&lt;T&gt;(value: T, delay = 300): T &#123;</div>
                                <div className="text-mint bg-mint/10 animate-highlight-flash rounded px-1 -mx-1"><span className="text-mint select-none">+ </span>  const [debounced, setDebounced] = useState&lt;T&gt;(value);</div>
                                <div className="text-mint bg-mint/10 animate-highlight-flash rounded px-1 -mx-1"><span className="text-mint select-none">+ </span>  const timer = setTimeout(() =&gt; setDebounced(value), delay);</div>
                                <div className="text-text-secondary"><span className="text-neutral-400 dark:text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}

                        {activeRevision === "v3" && (
                            <div className="space-y-1 text-[11px]">
                                <div className="text-text-secondary"><span className="text-neutral-400 dark:text-neutral-600 select-none">1 </span>export function useDebounce&lt;T&gt;(value: T, delay = 300): T &#123;</div>
                                <div className="text-text-secondary"><span className="text-neutral-400 dark:text-neutral-600 select-none">2 </span>  const [debounced, setDebounced] = useState&lt;T&gt;(value);</div>
                                <div className="text-mint bg-mint/10 animate-highlight-flash rounded px-1 -mx-1"><span className="text-mint select-none">+ </span>  useEffect(() =&gt; &#123; const t = setTimeout(...); return () =&gt; clearTimeout(t); &#125;);</div>
                                <div className="text-text-secondary"><span className="text-neutral-400 dark:text-neutral-600 select-none">4 </span>&#125;</div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-text-secondary border-t border-neutral-200/60 dark:border-neutral-800">
                        <span>Maintains complete fork ancestry</span>
                        <span className="font-semibold text-violet">3 Revisions</span>
                    </div>
                </div>
            ),
        },
        {
            id: "search",
            title: "Lightning Ctrl+K & ⌘K Search",
            subtitle: "Fuzzy-indexed keyboard query engine",
            badge: "Speed",
            badgeColor: "bg-cobalt/10 text-cobalt border-cobalt/20",
            icon: <Search className="h-5 w-5 text-cobalt" />,
            iconBg: "bg-cobalt/10 border-cobalt/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Search Input Box */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type to search (e.g. jwt, rust, #react)..."
                            className="w-full rounded-xl border border-neutral-200 bg-bg-base py-2 pl-9 pr-3 text-xs text-text-primary outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt dark:border-neutral-800 transition-colors"
                        />
                    </div>

                    {/* Filtered Results */}
                    <div className="space-y-1.5 h-[135px] overflow-y-auto">
                        {searchResults.slice(0, 3).map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedIndex(idx)}
                                className={`flex items-center justify-between rounded-xl p-2 text-xs cursor-pointer transition-all ${selectedIndex === idx
                                    ? "bg-cobalt/10 text-cobalt border border-cobalt/30 font-medium"
                                    : "hover:bg-bg-elevated text-text-secondary"
                                    }`}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <span className="rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-text-primary">
                                        {item.lang}
                                    </span>
                                    <span className="truncate font-medium text-[11px]">{item.title}</span>
                                </div>
                                <span className="text-[10px] text-cobalt shrink-0 font-medium">
                                    {item.tag}
                                </span>
                            </div>
                        ))}
                        {searchResults.length === 0 && (
                            <p className="text-center text-xs text-text-secondary py-6">No matching snippets</p>
                        )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-text-secondary border-t border-neutral-200/60 dark:border-neutral-800">
                        <span>Live keyword filter</span>
                        <kbd className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-text-primary border border-neutral-700/50">
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
            badgeColor: "bg-bg-elevated text-text-primary border-neutral-700/50",
            icon: <Sparkles className="h-5 w-5 text-cobalt" />,
            iconBg: "bg-cobalt/10 border-cobalt/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    <button
                        onClick={triggerAiExplanation}
                        disabled={isExplaining}
                        className="sheen-button flex w-full items-center justify-center gap-2 rounded-xl bg-cobalt px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cobalt/20 hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 transition-all disabled:opacity-75"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>{isExplaining ? "Analyzing Architecture..." : "Explain Snippet Live"}</span>
                    </button>

                    <div className="rounded-2xl border border-neutral-200/80 bg-bg-base p-3.5 text-xs dark:border-neutral-800 h-[135px] overflow-y-auto">
                        {aiProgress < 100 ? (
                            <div className="space-y-3 py-3">
                                <div className="h-2 w-full bg-bg-elevated rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cobalt transition-all duration-150"
                                        style={{ width: `${aiProgress}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-center text-text-secondary font-medium animate-pulse">Parsing AST & complexity profile...</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between text-[11px] font-bold text-text-primary">
                                    <span>Complexity Profile</span>
                                    <span className="font-mono text-cobalt">Time: O(1) | Space: O(1)</span>
                                </div>
                                <p className="text-[11px] text-text-secondary leading-relaxed">
                                    Encapsulates timer teardown on dependency shift to prevent unmounted memory leaks.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <div className="pt-2 text-[11px] text-text-secondary flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800">
                        <span className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3 text-mint" />
                            <span>Offline resilience</span>
                        </span>
                        <span className="font-semibold text-text-primary">Gemini Flash</span>
                    </div>
                </div>
            ),
        },
        {
            id: "taxonomy",
            title: "Many-to-Many Tag Taxonomy",
            subtitle: "Cross-index snippets by domains & patterns",
            badge: "Organization",
            badgeColor: "bg-bg-elevated text-text-primary border-neutral-700/50",
            icon: <FolderKanban className="h-5 w-5 text-cobalt" />,
            iconBg: "bg-cobalt/10 border-cobalt/20",
            renderContent: () => (
                <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Tag Cloud with Scale on Hover */}
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
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all border hover:scale-105 ${isSelected
                                        ? "bg-cobalt text-white border-cobalt shadow-xs"
                                        : "bg-bg-elevated text-text-secondary hover:border-cobalt hover:text-cobalt border-neutral-200 dark:border-neutral-800"
                                        }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-text-secondary border-t border-neutral-200/60 dark:border-neutral-800">
                        <span className="truncate">
                            Active: <strong className="text-text-primary">{selectedTags.join(", ") || "None"}</strong>
                        </span>
                        <motion.span
                            key={selectedTags.length}
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            className="rounded-full bg-cobalt/10 px-2 py-0.5 text-[10px] font-bold text-cobalt border border-cobalt/20 shrink-0"
                        >
                            {selectedTags.length * 3} matched
                        </motion.span>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <section className="relative mx-auto max-w-6xl px-4 py-8 md:py-10 overflow-hidden">
            {/* Subtle Ambient Radial Aura */}
            <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[450px] w-[700px] rounded-full bg-violet/[0.04] blur-[160px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-cobalt/[0.035] blur-[140px]" />

            {/* Section Header Card with Morphing View Mode Switcher */}
            <LaserBorderCard
                laserColor="mint"
                containerClassName="mb-6 relative z-10 w-full"
                className="p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-bg-surface/80 px-3.5 py-1 text-xs font-semibold text-text-secondary dark:border-neutral-800">
                        <Zap className="h-3.5 w-3.5 text-cobalt" />
                        <span>Engineered for Developer Productivity</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
                        Everything you need to master your snippet workflow
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-text-secondary max-w-xl leading-relaxed">
                        No more lost gists, buried Slack messages, or forgotten browser tabs.
                    </p>
                </div>

                {/* View Mode Switcher Tabs with Sliding Indicator */}
                <div className="flex items-center gap-1 self-start md:self-auto rounded-2xl border border-neutral-200/80 bg-bg-base/80 p-1 dark:border-neutral-800 backdrop-blur-md shrink-0">


                    <button
                        onClick={() => setViewMode("grid")}
                        className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            viewMode === "grid"
                                ? "text-white"
                                : "text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {viewMode === "grid" && (
                            <motion.div
                                layoutId="bentoViewModeIndicator"
                                className="absolute inset-0 rounded-xl bg-cobalt shadow-sm"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <LayoutGrid className="relative z-10 h-3.5 w-3.5" />
                        <span className="relative z-10">Grid View</span>
                    </button>

                    <button
                        onClick={() => setViewMode("stack")}
                        className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            viewMode === "stack"
                                ? "text-white"
                                : "text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {viewMode === "stack" && (
                            <motion.div
                                layoutId="bentoViewModeIndicator"
                                className="absolute inset-0 rounded-xl bg-cobalt shadow-sm"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <Layers className="relative z-10 h-3.5 w-3.5" />
                        <span className="relative z-10">Morphing Stack</span>
                    </button>
                </div>
            </LaserBorderCard>

            {/* Layout Container */}
            <LayoutGroup id="features-layout">
                {viewMode === "grid" ? (
                    /* 1. Symmetrical 2x2 Balanced Grid View */
                    <motion.div
                        layout
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                    >
                        {featureCards.map((card) => (
                            <motion.div
                                key={card.id}
                                layout
                                layoutId={`feature-card-${card.id}`}
                                className="group flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-bg-surface/95 p-6 sm:p-7 shadow-lg backdrop-blur-2xl transition-all duration-300 hover:border-cobalt/50 hover:shadow-2xl dark:border-neutral-800 dark:bg-bg-surface/90"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.iconBg}`}>
                                                {card.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-text-primary">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-text-secondary">
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
                        transition={{ duration: 0.3 }}
                        className="relative flex flex-col items-center justify-center py-6 min-h-[460px]"
                    >
                        <div className="relative w-full max-w-xl h-[420px] flex items-center justify-center [perspective:1000px]">
                            {featureCards.map((card, index) => {
                                const offset = (index - activeStackIndex + 4) % 4;
                                const isTop = offset === 0;

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
                                        className={`absolute w-full rounded-3xl border p-6 sm:p-7 shadow-2xl transition-shadow cursor-pointer ${isTop
                                            ? "border-cobalt bg-bg-surface/95 dark:bg-bg-surface/90 ring-2 ring-cobalt/20"
                                            : "border-neutral-200/70 bg-bg-surface/90 dark:border-neutral-800/70 dark:bg-bg-surface/85"
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
                                                    <h3 className="text-base font-bold text-text-primary">
                                                        {card.title}
                                                    </h3>
                                                    <p className="text-xs text-text-secondary">
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
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-bg-surface text-text-primary shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95 dark:border-neutral-800"
                                aria-label="Previous feature"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                {featureCards.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveStackIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === activeStackIndex
                                            ? "w-7 bg-cobalt shadow-xs shadow-cobalt/50"
                                            : "w-2 bg-bg-elevated hover:bg-neutral-600"
                                            }`}
                                        aria-label={`Go to feature ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextStackCard}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-bg-surface text-text-primary shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95 dark:border-neutral-800"
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
