"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Sparkles, Terminal, Shield, Zap, Command, Keyboard } from "lucide-react";

export function HeroSection() {
    return (
        <div className="relative flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-14 pb-4">
            {/* Seamless Edge-to-Edge Ambient Background Gradient */}
            <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[650px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 dark:opacity-30"
                    style={{
                        background:
                            "radial-gradient(ellipse 90% 60% at 50% 10%, rgba(99, 102, 241, 0.35), rgba(168, 85, 247, 0.15), transparent 75%)",
                    }}
                />
                <div
                    className="absolute inset-0 opacity-20 dark:opacity-15"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            {/* Announcement Pill Badge */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-indigo-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5 dark:border-indigo-900/60 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:border-indigo-700 dark:hover:bg-neutral-900"
                >
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        CodeVault v1.0
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span>Encrypted Developer Snippet Vault</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </Link>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl md:text-7xl dark:text-white"
            >
                Store. Organize. Protect. <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    Your Code Snippets.
                </span>
            </motion.h1>

            {/* Subtitle with Windows + Mac shortcuts */}
            <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
            >
                The developer-first snippet sanctuary. Save reusable snippets in
                encrypted vaults, search in milliseconds with{" "}
                <kbd className="rounded-md border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-mono font-semibold text-neutral-800 shadow-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    Ctrl + K
                </kbd>{" "}
                or{" "}
                <kbd className="rounded-md border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-mono font-semibold text-neutral-800 shadow-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    ⌘K
                </kbd>
                , and export beautiful Raycast-style cards with one click.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-7 flex flex-wrap items-center justify-center gap-4"
            >
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:scale-95"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>Get Started Free</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-white/70 px-7 py-3.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-neutral-100 hover:border-neutral-400 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                    <Terminal className="h-4 w-4 text-neutral-500" />
                    <span>Open Live Dashboard</span>
                </Link>
            </motion.div>

            {/* Feature Highlights Pills */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-500 dark:text-neutral-400"
            >
                <div className="flex items-center gap-1.5 font-medium">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>Client-side AES-256 Vault</span>
                </div>
                <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />
                <div className="flex items-center gap-1.5 font-medium">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>Instant Ctrl+K / ⌘K Search</span>
                </div>
                <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-800" />
                <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Ray.so Style Image Export</span>
                </div>
            </motion.div>
        </div>
    );
}
