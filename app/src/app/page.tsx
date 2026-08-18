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
import { ChaosVsVaultComparison } from "@/components/landing/ChaosVsVaultComparison";
import { GlobalBackgroundLayer } from "@/components/landing/GlobalBackgroundLayer";
import { KeyboardShortcutsModal } from "@/components/command/KeyboardShortcutsModal";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LaserBorderCard } from "@/components/ui/LaserBorderCard";

export default function HomePage() {
    return (
        <div className="relative flex flex-col min-h-screen bg-bg-base overflow-x-hidden">
            {/* Global Developer Keyboard Shortcuts HUD (? key) */}
            <KeyboardShortcutsModal />

            <main className="relative flex flex-col flex-1">
                {/* 1. Hero & 3D Container Scroll with GridScan WebGL */}
                <section className="relative w-full overflow-hidden bg-bg-base pb-6 md:pb-10">
                    <GlobalBackgroundLayer />
                    <div className="relative z-10">
                        <ContainerScroll
                            titleComponent={<HeroSection />}
                        >
                            <InteractiveSnippetMockup />
                        </ContainerScroll>
                    </div>
                </section>

                {/* Section Boundary 1: Lineage */}
                <div className="relative w-full flex items-center justify-center my-3 z-20">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
                    </div>
                    <div className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-surface px-4 py-1 text-[11px] font-mono text-text-secondary shadow-md backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
                        <span className="text-violet font-bold">01</span>
                        <span className="opacity-40">/</span>
                        <span>LINEAGE PROVENANCE</span>
                    </div>
                </div>

                {/* Body Sections Wrapper with Living Grainient & Blueprint Dot Grid */}
                <div className="relative w-full overflow-hidden">
                    <BodyBackgroundLayer />

                    {/* 2. Signature Visual Element: The Lineage Thread */}
                    <section className="relative w-full px-4 py-8 md:py-10 overflow-hidden">
                        <div className="mx-auto max-w-2xl text-center mb-5 relative z-10 flex justify-center">
                            <LaserBorderCard laserColor="violet" className="p-5 sm:p-6 text-center space-y-2 flex flex-col items-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-violet">
                                    The Signature Differentiator
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
                                    Every Fork Remembers Its Roots
                                </h2>
                            </LaserBorderCard>
                        </div>
                        <div className="relative z-10">
                            <LineageGraph />
                        </div>
                    </section>

                    {/* Section Boundary 2: Comparison */}
                    <div className="relative w-full flex items-center justify-center my-3 z-20">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-cobalt/40 to-transparent" />
                        </div>
                        <div className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-surface px-4 py-1 text-[11px] font-mono text-text-secondary shadow-md backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-cobalt animate-pulse" />
                            <span className="text-cobalt font-bold">02</span>
                            <span className="opacity-40">/</span>
                            <span>CHAOS VS VAULT</span>
                        </div>
                    </div>

                    {/* 3. The Pain vs The Solution: Chaos vs Sovereign Vault */}
                    <ChaosVsVaultComparison />

                    {/* Section Boundary 3: Showcase */}
                    <div className="relative w-full flex items-center justify-center my-3 z-20">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
                        </div>
                        <div className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-surface px-4 py-1 text-[11px] font-mono text-text-secondary shadow-md backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
                            <span className="text-violet font-bold">03</span>
                            <span className="opacity-40">/</span>
                            <span>INTERACTIVE SHOWCASE</span>
                        </div>
                    </div>

                    {/* 4. 3D Coverflow Interactive Snippet Showcase with Soft Stage Glow */}
                    <section className="relative w-full overflow-hidden py-2">
                        <CoverflowSnippetShowcase />
                    </section>

                    {/* Section Boundary 4: Features */}
                    <div className="relative w-full flex items-center justify-center my-3 z-20">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
                        </div>
                        <div className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-surface px-4 py-1 text-[11px] font-mono text-text-secondary shadow-md backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                            <span className="text-mint font-bold">04</span>
                            <span className="opacity-40">/</span>
                            <span>WORKFLOW ENGINE</span>
                        </div>
                    </div>

                    {/* 5. Interactive Feature Bento Grid with Live Micro-Widgets */}
                    <FeatureBentoGrid />

                    {/* 6. Enhanced Closer: CTA Banner, Trust Strip & Multi-Column SaaS Footer */}
                    <LandingFooter />
                </div>
            </main>
        </div>
    );
}
