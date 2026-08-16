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
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
    return (
        <div className="relative flex flex-col min-h-screen bg-bg-base overflow-x-hidden">
            {/* Global Developer Keyboard Shortcuts HUD (? key) */}
            <KeyboardShortcutsModal />

            <main className="relative flex flex-col flex-1">
                {/* 1. Hero & 3D Container Scroll with Scoped Atmospheric 3D Kinetic Layer & Small Code Snippets */}
                <section className="relative w-full overflow-hidden bg-bg-base pb-12 md:pb-20">
                    <GlobalBackgroundLayer />
                    <div className="relative z-10">
                        <ContainerScroll
                            titleComponent={<HeroSection />}
                        >
                            <InteractiveSnippetMockup />
                        </ContainerScroll>
                    </div>
                </section>

                {/* 2. Signature Visual Element: The Lineage Thread (Flat Obsidian Canvas) */}
                <section className="relative w-full px-4 py-12 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-bg-base">
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

                {/* 3. The Pain vs The Solution: Chaos vs Sovereign Vault */}
                <ChaosVsVaultComparison />

                {/* 4. 3D Coverflow Interactive Snippet Showcase with Click-to-Expand Modal */}
                <section className="relative w-full border-t border-neutral-200/60 dark:border-neutral-800/60 bg-bg-base">
                    <CoverflowSnippetShowcase />
                </section>

                {/* 5. Interactive Feature Bento Grid with Live Micro-Widgets */}
                <FeatureBentoGrid />

                {/* 6. Enhanced Closer: CTA Banner, Trust Strip & Multi-Column SaaS Footer */}
                <LandingFooter />
            </main>
        </div>
    );
}
