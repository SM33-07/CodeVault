"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    ArrowRight,
    Copy,
    Check,
    Terminal,
    GitFork,
    ShieldCheck,
    Zap,
    Scale,
    Star,
    ArrowUp,
    ExternalLink,
    Code2,
    Command,
    Mail,
} from "lucide-react";
import { toast } from "sonner";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function LinkedinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

interface CliStep {
    comment: string;
    cmd: string;
}

interface CliTab {
    id: "docker" | "git" | "npm";
    label: string;
    description: string;
    steps: CliStep[];
}

const CLI_TABS: CliTab[] = [
    {
        id: "docker",
        label: "Docker Compose",
        description: "Zero-configuration one-command self-hosting stack:",
        steps: [
            {
                comment: "# 1. Clone repository",
                cmd: "git clone https://github.com/SM33-07/CodeVault.git && cd CodeVault",
            },
            {
                comment: "# 2. Launch PostgreSQL + Express API + Next.js frontend",
                cmd: "docker compose up -d",
            },
        ],
    },
    {
        id: "git",
        label: "Git Clone",
        description: "Monorepo local development setup:",
        steps: [
            {
                comment: "# 1. Clone & install dependencies",
                cmd: "git clone https://github.com/SM33-07/CodeVault.git && cd CodeVault && npm install",
            },
            {
                comment: "# 2. Run Prisma database migrations",
                cmd: "cd server && npx prisma migrate dev && cd ..",
            },
            {
                comment: "# 3. Start frontend (:3000) and backend (:4001) concurrently",
                cmd: "npm run dev",
            },
        ],
    },
    {
        id: "npm",
        label: "npm Dev",
        description: "Quickly run development servers:",
        steps: [
            {
                comment: "# 1. Install monorepo dependencies",
                cmd: "npm install",
            },
            {
                comment: "# 2. Launch concurrent dev servers",
                cmd: "npm run dev",
            },
        ],
    },
];

const TRUST_STATS = [
    {
        icon: <GitFork className="h-4 w-4 text-violet" />,
        title: "100% Fork Lineage",
        desc: "Full ancestry graph for every code snippet",
    },
    {
        icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
        title: "Zero Telemetry",
        desc: "Self-hostable & air-gapped security",
    },
    {
        icon: <Scale className="h-4 w-4 text-amber-500" />,
        title: "MIT Licensed",
        desc: "Open source, free for personal and teams",
    },
    {
        icon: <Zap className="h-4 w-4 text-cobalt" />,
        title: "< 50ms Fuzzy Query",
        desc: "Instant keyboard-driven Ctrl+K search",
    },
];

export function LandingFooter() {
    const [activeCliTab, setActiveCliTab] = useState<"docker" | "git" | "npm">("docker");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    const currentTab = CLI_TABS.find((tab) => tab.id === activeCliTab) || CLI_TABS[0];

    const handleCopyStep = (cmd: string, idx: number) => {
        navigator.clipboard.writeText(cmd);
        setCopiedIndex(idx);
        toast.success("Command copied to clipboard!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const fullScript = currentTab.steps.map((s) => `${s.comment}\n${s.cmd}`).join("\n\n");
        navigator.clipboard.writeText(fullScript);
        setCopiedAll(true);
        toast.success("Full setup script copied!");
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const handleTriggerSearch = () => {
        const isMac = typeof window !== "undefined" && navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
        const event = new KeyboardEvent("keydown", {
            key: "k",
            code: "KeyK",
            metaKey: isMac,
            ctrlKey: !isMac,
            bubbles: true,
        });
        document.dispatchEvent(event);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Subtle Top Laser Divider */}
            <div className="relative w-full h-px bg-gradient-to-r from-transparent via-violet/25 to-transparent" />

            {/* 1. Main CTA Section */}
            <section className="mx-auto max-w-5xl px-4 pt-8 pb-10 w-full">
                <motion.div
                    initial={{ y: 0 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35 }}
                    className="group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-bg-surface/80 p-8 md:p-14 text-center text-text-primary shadow-2xl backdrop-blur-xl dark:border-neutral-800/80 dark:bg-bg-surface/75"
                >
                    {/* Ambient Glow Elements */}
                    <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-cobalt/20 blur-[100px] transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-violet/20 blur-[100px] transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1 text-xs font-semibold text-violet">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Ready to Transform How You Save Code?</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
                            Start building your personal{" "}
                            <span className="bg-gradient-to-r from-cobalt via-violet to-cobalt bg-clip-text text-transparent">
                                code vault today
                            </span>
                        </h2>

                        <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Organize, fork, and rediscover reusable code functions — with complete lineage tracking, AST intelligence, and AI explanations built right in.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <Link
                                href="/register"
                                className="sheen-button group inline-flex items-center gap-2 rounded-full bg-cobalt px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cobalt/25 transition-all duration-200 hover:bg-cobalt-hover hover:scale-105 active:bg-cobalt-active active:scale-95"
                            >
                                <span>Create Free Account</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/snippets"
                                className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-bg-elevated/90 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-md transition-all duration-200 hover:border-cobalt hover:text-cobalt hover:-translate-y-0.5 active:scale-95 shadow-sm"
                            >
                                <Terminal className="h-4 w-4 text-text-secondary group-hover:text-cobalt transition-colors" />
                                <span>Explore Public Snippets</span>
                            </Link>
                        </div>

                        {/* Quickstart Developer Terminal */}
                        <div className="mt-8 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80 text-left">
                            <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200/80 bg-bg-base p-4 shadow-inner dark:border-neutral-800">
                                {/* Terminal Tabs Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-200/60 dark:border-neutral-800 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                        </div>
                                        <span className="font-mono text-text-secondary text-[11px] font-semibold">
                                            quickstart-setup
                                        </span>
                                    </div>

                                    {/* Tabs & Copy All */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-bg-surface p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                                            {CLI_TABS.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveCliTab(tab.id)}
                                                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                                                        activeCliTab === tab.id
                                                            ? "bg-cobalt text-white shadow-xs font-semibold"
                                                            : "text-text-secondary hover:text-text-primary"
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleCopyAll}
                                            className="flex items-center gap-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-bg-elevated px-2 py-1 text-[10px] font-medium text-text-primary hover:border-cobalt hover:text-cobalt active:scale-95 transition-all"
                                            title="Copy full setup script"
                                        >
                                            {copiedAll ? (
                                                <>
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                    <span className="text-emerald-500 font-semibold">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3 text-text-secondary" />
                                                    <span>Copy All</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Step Description */}
                                <p className="text-[11px] text-text-secondary mb-3 font-mono">
                                    {currentTab.description}
                                </p>

                                {/* Terminal Steps List */}
                                <div className="space-y-3 font-mono text-xs">
                                    {currentTab.steps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-bg-surface/70 p-2.5 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-cobalt/40 transition-colors"
                                        >
                                            <div className="space-y-0.5 overflow-hidden">
                                                <span className="text-[10px] text-emerald-500/90 dark:text-emerald-400/90 select-none block">
                                                    {step.comment}
                                                </span>
                                                <div className="flex items-center gap-2 text-text-primary">
                                                    <span className="text-cobalt select-none font-bold">$</span>
                                                    <span className="truncate">{step.cmd}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleCopyStep(step.cmd, idx)}
                                                className="flex items-center gap-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-bg-elevated px-2 py-1 text-[10px] font-medium text-text-primary hover:border-cobalt hover:text-cobalt active:scale-95 transition-all shrink-0 self-end sm:self-auto"
                                                title="Copy command"
                                            >
                                                {copiedIndex === idx ? (
                                                    <>
                                                        <Check className="h-3 w-3 text-emerald-500" />
                                                        <span className="text-emerald-500">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3 w-3 text-text-secondary" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Trust & Architecture Strip */}
            <section className="mx-auto max-w-5xl px-4 pb-12 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {TRUST_STATS.map((stat, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center text-center p-4 rounded-2xl border border-neutral-200/80 bg-bg-surface/50 dark:border-neutral-800/80 backdrop-blur-md shadow-xs transition-all duration-200 hover:border-cobalt/40 hover:-translate-y-0.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-elevated border border-neutral-200 dark:border-neutral-800 mb-2.5">
                                {stat.icon}
                            </div>
                            <h4 className="text-xs font-bold text-text-primary tracking-tight">
                                {stat.title}
                            </h4>
                            <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                                {stat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Multi-Column SaaS Footer Architecture */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-bg-surface/90 backdrop-blur-xl px-4 pt-14 pb-8 text-xs text-text-secondary">
                <div className="mx-auto max-w-6xl space-y-12">
                    {/* Top Row: Brand & Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
                        {/* Brand Column (Spans 2 on desktop) */}
                        <div className="md:col-span-2 space-y-4">
                            <Link href="/" className="inline-flex items-center group">
                                <Image
                                    src="/images/logo_codevault_light.png"
                                    alt="CodeVault"
                                    width={150}
                                    height={38}
                                    className="h-7 md:h-8 w-auto object-contain transition-all duration-300 group-hover:scale-105 dark:hidden"
                                />
                                <Image
                                    src="/images/logo_codevault_dark.png"
                                    alt="CodeVault"
                                    width={150}
                                    height={38}
                                    className="h-7 md:h-8 w-auto object-contain transition-all duration-300 group-hover:scale-105 hidden dark:block"
                                />
                            </Link>

                            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
                                The self-hostable snippet vault built for modern engineering teams. Save functions, trace fork lineages back to roots, and query with instant keyboard precision.
                            </p>

                            {/* Author Social Links */}
                            <div className="flex items-center gap-2 pt-0.5">
                                <a
                                    href="https://github.com/SM33-07"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-bg-elevated text-text-secondary hover:border-cobalt hover:text-cobalt hover:-translate-y-0.5 transition-all shadow-xs"
                                    title="GitHub (SM33-07)"
                                    aria-label="GitHub Profile"
                                >
                                    <GithubIcon className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/soham-more-muj/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-bg-elevated text-text-secondary hover:border-[#0A66C2] hover:text-[#0A66C2] hover:-translate-y-0.5 transition-all shadow-xs"
                                    title="LinkedIn Profile"
                                    aria-label="LinkedIn Profile"
                                >
                                    <LinkedinIcon className="h-4 w-4" />
                                </a>
                                <a
                                    href="mailto:sohammore3312@gmail.com"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-bg-elevated text-text-secondary hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5 transition-all shadow-xs"
                                    title="Email (sohammore3312@gmail.com)"
                                    aria-label="Email Contact"
                                >
                                    <Mail className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Live System Status Pill */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>All Systems Operational</span>
                            </div>
                        </div>

                        {/* Column 1: Product */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-text-primary">
                                Product
                            </h4>
                            <ul className="space-y-2 text-text-secondary">
                                <li>
                                    <Link href="/snippets" className="hover:text-cobalt transition-colors">
                                        Public Snippet Library
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="hover:text-cobalt transition-colors">
                                        Developer Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleTriggerSearch}
                                        className="hover:text-cobalt transition-colors text-left flex items-center gap-1.5"
                                    >
                                        <span>Command Palette</span>
                                        <kbd className="rounded bg-bg-elevated px-1 py-0.5 font-mono text-[9px] border border-neutral-700/50">⌘K / Ctrl+K</kbd>
                                    </button>
                                </li>
                                <li>
                                    <Link href="/register" className="hover:text-cobalt transition-colors">
                                        Create Free Account
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Developers */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-text-primary">
                                Developers
                            </h4>
                            <ul className="space-y-2 text-text-secondary">
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault#readme"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cobalt transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>Documentation</span>
                                        <ExternalLink className="h-3 w-3 opacity-60" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cobalt transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>Docker Deployment</span>
                                        <ExternalLink className="h-3 w-3 opacity-60" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cobalt transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>REST API Specs</span>
                                        <ExternalLink className="h-3 w-3 opacity-60" />
                                    </a>
                                </li>
                                <li>
                                    <Link href="/snippets/new" className="hover:text-cobalt transition-colors">
                                        Create Snippet
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Open Source & Community */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-text-primary">
                                Open Source
                            </h4>
                            <ul className="space-y-2 text-text-secondary">
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cobalt transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <GithubIcon className="h-3.5 w-3.5" />
                                        <span>GitHub Repository</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-bg-elevated px-2 py-1 text-[11px] font-medium text-text-primary hover:border-amber-500 hover:text-amber-500 transition-all"
                                    >
                                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                        <span>Star on GitHub</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/SM33-07/CodeVault/blob/main/LICENSE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cobalt transition-colors"
                                    >
                                        MIT License
                                    </a>
                                </li>
                                <li>
                                    <span className="text-[11px] text-text-secondary">Release v1.0.0</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar: Copyright, Shortcut Pill, Back to Top */}
                    <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] text-text-secondary">
                            © {new Date().getFullYear()} CodeVault. Store. Fork. Discover. Code.
                        </p>

                        <div className="flex items-center gap-4">
                            {/* Interactive Command Palette Trigger */}
                            <button
                                onClick={handleTriggerSearch}
                                className="group flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-bg-elevated px-3 py-1 text-[11px] text-text-secondary hover:border-cobalt hover:text-cobalt transition-all"
                            >
                                <Command className="h-3 w-3 text-cobalt" />
                                <span>Press</span>
                                <kbd className="font-mono font-semibold text-text-primary">⌘K / Ctrl+K</kbd>
                                <span>to search</span>
                            </button>

                            {/* Back to top */}
                            <button
                                onClick={scrollToTop}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-bg-elevated text-text-secondary hover:border-cobalt hover:text-cobalt hover:-translate-y-0.5 active:scale-95 transition-all"
                                aria-label="Scroll back to top"
                                title="Back to top"
                            >
                                <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
