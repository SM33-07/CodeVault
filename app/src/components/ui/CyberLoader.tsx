"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyberLoaderProps {
    size?: "sm" | "md" | "lg";
    label?: string;
    subtitle?: string;
    fullscreen?: boolean;
    className?: string;
}

export function CyberLoader({
    size = "md",
    label,
    subtitle,
    fullscreen = false,
    className = "",
}: CyberLoaderProps) {
    const bars = [
        { height: [0.35, 1, 0.35], delay: 0 },
        { height: [0.55, 0.3, 0.85, 0.55], delay: 0.12 },
        { height: [0.25, 0.9, 0.4, 0.25], delay: 0.24 },
        { height: [0.7, 0.35, 1, 0.7], delay: 0.36 },
        { height: [0.4, 0.85, 0.2, 0.4], delay: 0.48 },
    ];

    const sizeConfig = {
        sm: {
            containerHeight: "h-5",
            barWidth: "w-1",
            gap: "gap-1",
            maxHeight: 20,
            textClass: "text-[10px]",
        },
        md: {
            containerHeight: "h-9",
            barWidth: "w-1.5",
            gap: "gap-1.5",
            maxHeight: 36,
            textClass: "text-xs font-medium",
        },
        lg: {
            containerHeight: "h-16",
            barWidth: "w-2.5 sm:w-3",
            gap: "gap-2 sm:gap-2.5",
            maxHeight: 64,
            textClass: "text-sm sm:text-base font-semibold tracking-wide",
        },
    };

    const config = sizeConfig[size];

    const LoaderContent = (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            {/* Equalizer Bar Matrix */}
            <div className={`flex items-end justify-center ${config.containerHeight} ${config.gap}`}>
                {bars.map((bar, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                        <motion.div
                            animate={{
                                height: bar.height.map((h) => `${Math.round(h * config.maxHeight)}px`),
                                opacity: [0.65, 1, 0.65],
                            }}
                            transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: bar.delay,
                            }}
                            className={`${config.barWidth} rounded-full bg-gradient-to-t from-[#8B5CF6] via-[#3B82F6] to-[#60A5FA] shadow-[0_0_12px_rgba(59,130,246,0.6)]`}
                        />
                        {/* Floor Reflection Glow */}
                        {size !== "sm" && (
                            <motion.div
                                animate={{
                                    opacity: [0.2, 0.55, 0.2],
                                    scaleX: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 1.1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: bar.delay,
                                }}
                                className="absolute -bottom-1.5 h-1 w-full rounded-full bg-cobalt/40 blur-[2px]"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Optional Typography / Terminal Status */}
            {label && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 flex items-center gap-2"
                >
                    <span className={`text-text-primary ${config.textClass}`}>
                        {label}
                    </span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block h-3.5 w-1.5 rounded-xs bg-cobalt"
                    />
                </motion.div>
            )}

            {/* Optional Subtitle / Status description */}
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-1.5 text-xs text-text-secondary text-center font-mono tracking-normal"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );

    if (fullscreen) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 z-[999999] flex items-center justify-center bg-bg-base overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative z-10 mx-4 flex flex-col items-center justify-center rounded-3xl border border-neutral-200/80 bg-bg-surface/95 backdrop-blur-2xl px-10 py-8 shadow-2xl dark:border-neutral-800"
                >
                    {/* Glowing background halo */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cobalt/25 via-violet/25 to-cobalt/25 blur-xl opacity-70 pointer-events-none" />

                    <div className="relative z-10">
                        {LoaderContent}
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return LoaderContent;
}
