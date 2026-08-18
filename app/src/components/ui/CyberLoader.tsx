"use client";

import React from "react";
import { motion } from "framer-motion";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";

interface CyberLoaderProps {
    size?: "sm" | "md" | "lg";
    label?: string;
    fullscreen?: boolean;
    className?: string;
}

export function CyberLoader({
    size = "md",
    label,
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
            textClass: "text-xs",
        },
        lg: {
            containerHeight: "h-16",
            barWidth: "w-2.5 sm:w-3",
            gap: "gap-2 sm:gap-2.5",
            maxHeight: 64,
            textClass: "text-sm font-semibold tracking-wide",
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
                    transition={{ delay: 0.15 }}
                    className="mt-3.5 flex items-center gap-1.5"
                >
                    <span className={`text-text-primary ${config.textClass}`}>
                        {label}
                    </span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block h-3 w-1.5 rounded-xs bg-cobalt"
                    />
                </motion.div>
            )}
        </div>
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-bg-base overflow-hidden">
                <BodyBackgroundLayer isFixed />

                <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 mx-4 flex flex-col items-center justify-center rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl dark:border-neutral-800"
                >
                    {/* Glowing background halo */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cobalt/20 via-violet/20 to-cobalt/20 blur-xl opacity-60 pointer-events-none" />

                    <div className="relative z-10">
                        {LoaderContent}
                    </div>
                </motion.div>
            </div>
        );
    }

    return LoaderContent;
}
