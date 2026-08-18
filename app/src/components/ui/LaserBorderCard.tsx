"use client";

import React from "react";
import { motion } from "framer-motion";

interface LaserBorderCardProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    laserColor?: "violet" | "cobalt" | "mint" | "multi";
}

export function LaserBorderCard({
    children,
    className = "",
    containerClassName = "",
    laserColor = "multi",
}: LaserBorderCardProps) {
    const gradient =
        laserColor === "violet"
            ? "conic-gradient(from 0deg, transparent 0 280deg, #A855F7 320deg, #6D28D9 360deg)"
            : laserColor === "cobalt"
            ? "conic-gradient(from 0deg, transparent 0 280deg, #38BDF8 320deg, #2563EB 360deg)"
            : laserColor === "mint"
            ? "conic-gradient(from 0deg, transparent 0 280deg, #34D399 320deg, #059669 360deg)"
            : "conic-gradient(from 0deg, transparent 0 260deg, #38BDF8 300deg, #818CF8 330deg, #C084FC 360deg)";

    return (
        <div className={`relative p-[1.5px] rounded-3xl overflow-hidden shadow-xl ${containerClassName}`}>
            {/* 1. Animated Continuous Laser Lightning Beam */}
            <motion.div
                className="absolute -inset-[200%] pointer-events-none"
                style={{
                    background: gradient,
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* 2. Soft Ambient Lightning Aura */}
            <div className="absolute inset-0 rounded-3xl border border-neutral-300/60 dark:border-neutral-700/60 pointer-events-none z-10" />

            {/* 3. Frosted Glass Inner Surface */}
            <div
                className={`relative z-10 rounded-[22.5px] bg-bg-surface/95 dark:bg-bg-surface/90 backdrop-blur-2xl ${className}`}
            >
                {children}
            </div>
        </div>
    );
}

export default LaserBorderCard;
