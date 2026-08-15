"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Code2,
    Sparkles,
    Search,
    ArrowRight,
    Terminal,
    GitFork,
    FolderKanban,
} from "lucide-react";

import { HeroSection } from "@/components/landing/HeroSection";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { InteractiveSnippetMockup } from "@/components/landing/InteractiveSnippetMockup";
import { SnippetFilterGrid } from "@/components/snippets/SnippetFilterGrid";

const FEATURES = [
    {
        title: "Fork Lineage Tracking",
        description:
            "Every fork remembers its origin. Trace any snippet back through its full revision chain to the original author.",
        icon: <GitFork className="h-5 w-5 text-amber-400" />,
        badge: "Provenance",
    },
    {
        title: "Lightning Ctrl+K & ⌘K Search",
        description:
            "Find any snippet across syntax, descriptions, or tags with instant fuzzy-indexed keyboard search.",
        icon: <Search className="h-5 w-5 text-teal-400" />,
        badge: "Speed",
    },
    {
        title: "AI-Powered Explanation",
        description:
            "Generate on-demand natural-language explanations for any snippet. Falls back gracefully when the AI provider is unavailable.",
        icon: <Sparkles className="h-5 w-5 text-purple-400" />,
        badge: "Intelligence",
    },
    {
        title: "Multi-Language Tag Collections",
        description:
            "Organize code by many-to-many tags and languages (TypeScript, Python, Rust, Go, SQL, Docker, and 40+ others).",
        icon: <FolderKanban className="h-5 w-5 text-cyan-400" />,
        badge: "Organization",
    },
];

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50/50 dark:bg-neutral-950">
            {/* 1. Hero & 3D Container Scroll */}
            <section className="relative w-full">
                <ContainerScroll
                    titleComponent={<HeroSection />}
                >
                    <InteractiveSnippetMockup />
                </ContainerScroll>
            </section>

            {/* 2. Interactive Snippet Cards Grid (Course Design Cards Style) */}
            <section className="relative w-full border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/30">
                <SnippetFilterGrid />
            </section>

            {/* 2. Bento Feature Grid */}
            <section className="mx-auto max-w-6xl px-4 py-20">
                <div className="text-center mb-14">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        Built for Modern Engineers
                    </p>
                    <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
                        Everything you need to master your snippet workflow
                    </h2>
                    <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-sm md:text-base">
                        No more lost gists, buried Slack messages, or forgotten StackOverflow tabs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-indigo-500/40"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                        {feature.badge}
                                    </span>
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-neutral-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Call to Action Banner */}
            <section className="mx-auto max-w-5xl px-4 py-16 w-full">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 md:p-12 text-center text-white shadow-2xl shadow-indigo-500/20">
                    {/* Background glow accents */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-400/20 blur-2xl" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Start building your personal code vault today
                        </h2>
                        <p className="mt-3 text-indigo-100 max-w-xl mx-auto text-sm md:text-base">
                            Organize, fork, and rediscover your code — with lineage tracking and AI explanations built in.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 shadow-lg transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950 px-4 py-8 text-center text-xs text-neutral-500">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© 2026 CodeVault. Store. Fork. Discover. Code.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors">
                            Register
                        </Link>
                        <span className="text-neutral-400">⌘K to search</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
