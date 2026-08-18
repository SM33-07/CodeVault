"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberLoader } from "./CyberLoader";

export function RouteTransitionLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [isDelayed, setIsDelayed] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset navigation state when route change finishes
    useEffect(() => {
        setIsNavigating(false);
        setIsDelayed(false);
        setProgress(100);
        const timer = setTimeout(() => setProgress(0), 300);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    // If navigation takes longer than 200ms, display prominent centered cyber loader
    useEffect(() => {
        let delayTimer: NodeJS.Timeout;
        if (isNavigating) {
            delayTimer = setTimeout(() => {
                setIsDelayed(true);
            }, 200);
        } else {
            setIsDelayed(false);
        }
        return () => clearTimeout(delayTimer);
    }, [isNavigating]);

    // Intercept internal link clicks to give immediate visual feedback
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a");
            if (!target) return;

            const href = target.getAttribute("href");
            if (
                href &&
                href.startsWith("/") &&
                !href.startsWith("#") &&
                target.target !== "_blank" &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.shiftKey &&
                !e.altKey
            ) {
                const currentUrl = window.location.pathname;
                const targetUrl = href.split("?")[0].split("#")[0];

                if (targetUrl !== currentUrl) {
                    setIsNavigating(true);
                    setProgress(30);

                    // Animate progress smoothly
                    setTimeout(() => setProgress((p) => (p === 30 ? 70 : p)), 80);
                    setTimeout(() => setProgress((p) => (p === 70 ? 90 : p)), 250);
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
        };
    }, []);

    if (!isNavigating && progress === 0) return null;

    return (
        <div className="fixed inset-0 z-[999999] pointer-events-none">
            {/* Top Laser Progress Bar */}
            <motion.div
                initial={{ width: "0%", opacity: 1 }}
                animate={{
                    width: isNavigating ? `${progress}%` : "100%",
                    opacity: progress === 100 ? [1, 0] : 1,
                }}
                transition={{
                    width: { duration: 0.25, ease: "easeOut" },
                    opacity: { duration: 0.25, delay: 0.1 },
                }}
                className="h-[3px] bg-gradient-to-r from-cobalt via-violet to-mint shadow-[0_0_15px_rgba(59,130,246,0.9),0_0_25px_rgba(139,92,246,0.7)]"
            />

            {/* Prominent Obsidian Center CyberLoader for users stuck on loading (>200ms) */}
            <AnimatePresence>
                {isDelayed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 8 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 6 }}
                            className="relative mx-4 flex flex-col items-center rounded-3xl border border-neutral-200/80 bg-bg-surface/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl dark:border-neutral-800"
                        >
                            {/* Halo glow */}
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cobalt/30 via-violet/30 to-cobalt/30 blur-xl opacity-70 pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center">
                                <CyberLoader size="lg" label="Decrypting Vault Route..." />
                                
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 text-[11px] font-semibold text-text-secondary hover:text-cobalt transition-colors"
                                >
                                    Taking longer than usual? Click to reload
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
