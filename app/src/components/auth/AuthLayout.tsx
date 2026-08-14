"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
}

// Animated floating orb component
function FloatingOrb({
    className,
    delay = 0,
}: {
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                delay,
                ease: "easeInOut",
            }}
        />
    );
}

// Animated code lines for the right panel
function AnimatedCodePreview() {
    const codeLines = [
        { indent: 0, width: "60%", color: "bg-indigo-400/30" },
        { indent: 1, width: "80%", color: "bg-purple-400/20" },
        { indent: 1, width: "50%", color: "bg-violet-400/25" },
        { indent: 2, width: "70%", color: "bg-indigo-300/20" },
        { indent: 2, width: "40%", color: "bg-purple-300/15" },
        { indent: 1, width: "30%", color: "bg-violet-400/20" },
        { indent: 0, width: "20%", color: "bg-indigo-400/25" },
        { indent: 0, width: "65%", color: "bg-purple-400/20" },
        { indent: 1, width: "55%", color: "bg-violet-300/20" },
        { indent: 1, width: "75%", color: "bg-indigo-400/15" },
        { indent: 2, width: "45%", color: "bg-purple-400/25" },
        { indent: 0, width: "25%", color: "bg-violet-400/20" },
    ];

    return (
        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {/* Window controls */}
            <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-green-400/60" />
                <span className="ml-3 text-xs text-white/30 font-mono">
                    snippet.tsx
                </span>
            </div>

            {/* Code lines */}
            <div className="space-y-2">
                {codeLines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.8 + i * 0.1,
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                        className="flex items-center"
                        style={{ paddingLeft: `${line.indent * 20}px` }}
                    >
                        <span className="mr-3 w-4 text-right font-mono text-[10px] text-white/20">
                            {i + 1}
                        </span>
                        <motion.div
                            className={`h-3 rounded-sm ${line.color}`}
                            style={{ width: line.width }}
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    footerText,
    footerLinkText,
    footerLinkHref,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full pt-20">
            {/* Left Panel - Form */}
            <div className="relative flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-indigo-950/20" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-[420px]"
                >
                    {/* Logo */}
                    <Link href="/" className="mb-8 inline-flex items-center group">
                        <Image
                            src="/images/logo_codevault.png"
                            alt="CodeVault"
                            width={180}
                            height={48}
                            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            priority
                        />
                    </Link>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Form content (children) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {children}
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
                    >
                        {footerText}{" "}
                        <Link
                            href={footerLinkHref}
                            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                            {footerLinkText}
                        </Link>
                    </motion.p>
                </motion.div>
            </div>

            {/* Right Panel - Visual */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                {/* Animated mesh gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />

                {/* Animated grid pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Floating gradient orbs */}
                <FloatingOrb
                    className="absolute left-[15%] top-[20%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
                    delay={0}
                />
                <FloatingOrb
                    className="absolute right-[10%] top-[50%] h-96 w-96 rounded-full bg-purple-500/15 blur-3xl"
                    delay={2}
                />
                <FloatingOrb
                    className="absolute bottom-[15%] left-[30%] h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
                    delay={4}
                />

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center gap-8 px-12">
                    {/* Logo Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <Image
                            src="/images/logo_codevault.png"
                            alt="CodeVault"
                            width={360}
                            height={100}
                            className="h-20 w-auto object-contain mix-blend-screen drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]"
                            priority
                        />
                    </motion.div>

                    {/* Code preview card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.7 }}
                    >
                        <AnimatedCodePreview />
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="flex items-center gap-8 text-white/40"
                    >
                        <div className="text-center">
                            <p className="text-lg font-bold text-white/70">50+</p>
                            <p className="text-xs">Languages</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-white/70">∞</p>
                            <p className="text-xs">Snippets</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-white/70">🔒</p>
                            <p className="text-xs">Secure</p>
                        </div>
                    </motion.div>
                </div>

                {/* Edge glow */}
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent" />
            </div>
        </div>
    );
}
