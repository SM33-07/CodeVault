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
        { indent: 0, width: "60%", color: "bg-cobalt/30" },
        { indent: 1, width: "80%", color: "bg-violet/20" },
        { indent: 1, width: "50%", color: "bg-cobalt/25" },
        { indent: 2, width: "70%", color: "bg-cobalt/20" },
        { indent: 2, width: "40%", color: "bg-violet/15" },
        { indent: 1, width: "30%", color: "bg-cobalt/20" },
        { indent: 0, width: "20%", color: "bg-violet/25" },
        { indent: 0, width: "65%", color: "bg-cobalt/20" },
        { indent: 1, width: "55%", color: "bg-violet/20" },
        { indent: 1, width: "75%", color: "bg-cobalt/15" },
        { indent: 2, width: "45%", color: "bg-violet/25" },
        { indent: 0, width: "25%", color: "bg-cobalt/20" },
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
                        initial={{ x: -20 }}
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
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
            {/* Left Panel - Form */}
            <div className="relative flex w-full flex-col items-center justify-center px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 dark:from-bg-base dark:via-bg-surface dark:to-bg-base" />

                <motion.div
                    initial={{ y: 15 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-[420px]"
                >
                    {/* Logo */}
                    <Link href="/" className="mb-6 inline-flex items-center group">
                        <Image
                            src="/images/logo_codevault_light.png"
                            alt="CodeVault"
                            width={180}
                            height={48}
                            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 dark:hidden"
                            priority
                        />
                        <Image
                            src="/images/logo_codevault_dark.png"
                            alt="CodeVault"
                            width={180}
                            height={48}
                            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 hidden dark:block"
                            priority
                        />
                    </Link>

                    {/* Title */}
                    <motion.div
                        initial={{ y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="mb-6"
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Form content (children) */}
                    <motion.div
                        initial={{ y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {children}
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400"
                    >
                        {footerText}{" "}
                        <Link
                            href={footerLinkHref}
                            className="font-semibold text-cobalt hover:text-cobalt-hover transition-colors"
                        >
                            {footerLinkText}
                        </Link>
                    </motion.p>
                </motion.div>
            </div>

            {/* Right Panel - Visual */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center py-8">
                {/* Animated mesh gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#080B10] via-[#11161F] to-[#171E29]" />

                {/* Animated grid pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Floating gradient orbs */}
                <FloatingOrb
                    className="absolute left-[15%] top-[20%] h-72 w-72 rounded-full bg-cobalt/15 blur-3xl"
                    delay={0}
                />
                <FloatingOrb
                    className="absolute right-[10%] top-[50%] h-96 w-96 rounded-full bg-violet/12 blur-3xl"
                    delay={2}
                />
                <FloatingOrb
                    className="absolute bottom-[15%] left-[30%] h-64 w-64 rounded-full bg-cobalt/15 blur-3xl"
                    delay={4}
                />

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center gap-6 px-12">
                    {/* Logo Banner */}
                    <motion.div
                        initial={{ scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <Image
                            src="/images/logo_codevault_dark.png"
                            alt="CodeVault"
                            width={320}
                            height={80}
                            className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                            priority
                        />
                    </motion.div>

                    {/* Code preview card */}
                    <motion.div
                        initial={{ y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.7 }}
                    >
                        <AnimatedCodePreview />
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ y: 10 }}
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
                            <p className="text-xs">Private</p>
                        </div>
                    </motion.div>
                </div>

                {/* Edge glow */}
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cobalt/40 to-transparent" />
            </div>
        </div>
    );
}
