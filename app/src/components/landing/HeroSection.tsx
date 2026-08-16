"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitFork, Sparkles, Terminal, Search, Zap } from "lucide-react";

export function HeroSection() {
    return (
        <div className="relative flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-14 pb-4">
            {/* Seamless Edge-to-Edge Ambient Background Gradient */}
            <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[650px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 dark:opacity-30"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(59, 130, 246, 0.12), rgba(124, 58, 237, 0.10), transparent 70%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-20 dark:opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            {/* Announcement Pill Badge */}
            <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-full border border-violet/30 bg-bg-surface/80 px-4 py-1.5 text-xs font-medium text-text-primary shadow-sm backdrop-blur-md transition-all duration-300 hover:border-violet hover:shadow-md hover:-translate-y-0.5 dark:border-violet/25"
                >
                    <span className="flex h-2 w-2 rounded-full bg-violet animate-pulse" />
                    <span className="font-semibold text-violet">
                        CodeVault v1.0
                    </span>
                    <span className="text-neutral-400 dark:text-neutral-600">•</span>
                    <span>Self-Hostable Snippet Manager</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-text-secondary group-hover:text-violet" />
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
                        className="block bg-gradient-to-r from-cobalt via-violet to-cobalt bg-clip-text text-transparent animate-shimmer"
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
                The self-hostable home for code snippets. Save reusable functions,
                trace fork lineages back to original authors, search across languages
                and tags, and generate on-demand AI explanations — all with{" "}
                <kbd className="rounded-md border border-neutral-300 bg-bg-elevated px-2 py-0.5 text-xs font-mono font-semibold text-text-primary shadow-xs dark:border-neutral-700">
                    Ctrl + K
                </kbd>{" "}
                or{" "}
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
                    <Sparkles className="h-4 w-4" />
                    <span>Get Started Free</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </Link>

                <Link
                    href="/snippets"
                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-bg-surface/80 px-7 py-3.5 text-sm font-semibold text-text-primary shadow-sm backdrop-blur-md transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:-translate-y-0.5 active:scale-95 dark:border-neutral-800"
                >
                    <Terminal className="h-4 w-4 text-text-secondary group-hover:text-emerald-400 transition-colors" />
                    <span>Explore Public Snippets</span>
                </Link>
            </motion.div>

            {/* Feature Highlights Pills */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.38 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-text-secondary"
            >
                <div className="group flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <GitFork className="h-4 w-4 text-violet transition-transform group-hover:scale-110" />
                    <span className="group-hover:text-text-primary transition-colors">Fork Lineage Tracking</span>
                </div>
                <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />
                <div className="group flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <Search className="h-4 w-4 text-cobalt transition-transform group-hover:scale-110" />
                    <span className="group-hover:text-text-primary transition-colors">Multi-Language Tag Search</span>
                </div>
                <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />
                <div className="group flex items-center gap-1.5 font-medium transition-all hover:-translate-y-0.5 cursor-default">
                    <Sparkles className="h-4 w-4 text-mint transition-transform group-hover:scale-110" />
                    <span className="group-hover:text-text-primary transition-colors">On-Demand AI Explanation</span>
                </div>
            </motion.div>
        </div>
    );
}
