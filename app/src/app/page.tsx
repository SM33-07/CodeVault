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
import { LineageGraph } from "@/components/landing/LineageGraph";
import { CoverflowSnippetShowcase } from "@/components/snippets/CoverflowSnippetShowcase";
import { FeatureBentoGrid } from "@/components/landing/FeatureBentoGrid";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-bg-base">
            {/* 1. Hero & 3D Container Scroll */}
            <section className="relative w-full">
                <ContainerScroll
                    titleComponent={<HeroSection />}
                >
                    <InteractiveSnippetMockup />
                </ContainerScroll>
            </section>

            {/* 2. Signature Visual Element: The Lineage Thread */}
            <section className="relative w-full px-4 py-8 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-transparent via-violet/5 to-transparent">
                <div className="mx-auto max-w-5xl text-center space-y-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-violet">
                        The Signature Differentiator
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
                        Every Fork Remembers Its Roots
                    </h2>
                </div>
                <LineageGraph />
            </section>

            {/* 3. 3D Coverflow Interactive Snippet Showcase with Click-to-Expand Modal */}
            <section className="relative w-full border-t border-neutral-200/60 dark:border-neutral-800/60 bg-bg-surface/30">
                <CoverflowSnippetShowcase />
            </section>

            {/* 4. Interactive Feature Bento Grid with Live Micro-Widgets */}
            <FeatureBentoGrid />

            {/* 5. Call to Action Banner */}
            <section className="mx-auto max-w-5xl px-4 py-16 w-full">
                <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-bg-surface p-8 md:p-12 text-center text-text-primary shadow-2xl">
                    {/* Background glow accents */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cobalt/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
                            Start building your personal code vault today
                        </h2>
                        <p className="mt-3 text-text-secondary max-w-xl mx-auto text-sm md:text-base">
                            Organize, fork, and rediscover your code — with lineage tracking and AI explanations built in.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="rounded-full bg-cobalt px-8 py-3 text-sm font-bold text-white shadow-lg shadow-cobalt/25 transition-all duration-200 hover:bg-cobalt-hover hover:scale-105 active:bg-cobalt-active active:scale-95"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-elevated px-8 py-3 text-sm font-semibold text-text-primary backdrop-blur-md transition-all duration-200 hover:border-cobalt hover:text-cobalt"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-bg-surface px-4 py-8 text-center text-xs text-text-secondary">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <p>© 2026 CodeVault. Store. Fork. Discover. Code.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:text-cobalt transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register" className="hover:text-cobalt transition-colors">
                            Register
                        </Link>
                        <span className="text-text-secondary">⌘K to search</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
