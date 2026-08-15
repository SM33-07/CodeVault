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
import { CoverflowSnippetShowcase } from "@/components/snippets/CoverflowSnippetShowcase";
import { FeatureBentoGrid } from "@/components/landing/FeatureBentoGrid";

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

            {/* 2. 3D Coverflow Interactive Snippet Showcase with Click-to-Expand Modal */}
            <section className="relative w-full border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/40 dark:bg-neutral-900/30">
                <CoverflowSnippetShowcase />
            </section>

            {/* 3. Interactive Feature Bento Grid with Live Micro-Widgets */}
            <FeatureBentoGrid />

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
