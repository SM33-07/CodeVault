"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberLoader } from "./CyberLoader";

export function RouteTransitionLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [isStuck, setIsStuck] = useState(false);
    const [progress, setProgress] = useState(0);

    const startTimeRef = useRef<number>(0);
    const prevPathnameRef = useRef(pathname);

    // When pathname or searchParams change, ensure minimum display duration so animation is always appreciated
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;

            const elapsedTime = Date.now() - startTimeRef.current;
            const minDuration = 450; // Guaranteed minimum display time for smooth visual satisfaction
            const remainingTime = Math.max(0, minDuration - elapsedTime);

            setProgress(100);

            const hideTimer = setTimeout(() => {
                setIsNavigating(false);
                setIsStuck(false);
                setTimeout(() => setProgress(0), 300);
            }, remainingTime);

            return () => clearTimeout(hideTimer);
        }
    }, [pathname, searchParams]);

    // Handle stuck state if network lag exceeds 3.5s
    useEffect(() => {
        let stuckTimer: NodeJS.Timeout;
        if (isNavigating) {
            stuckTimer = setTimeout(() => {
                setIsStuck(true);
            }, 3500);
        } else {
            setIsStuck(false);
        }
        return () => clearTimeout(stuckTimer);
    }, [isNavigating]);

    // Intercept internal link clicks to trigger loader every single time
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
                    startTimeRef.current = Date.now();
                    setIsNavigating(true);
                    setIsStuck(false);
                    setProgress(35);

                    // Accelerate laser progress bar
                    setTimeout(() => setProgress((p) => (p === 35 ? 75 : p)), 100);
                    setTimeout(() => setProgress((p) => (p === 75 ? 90 : p)), 250);
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
            {/* Top Laser Lightning Progress Bar */}
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

            {/* Prominent Centered Obsidian CyberLoader displayed every time on page switch */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto fixed inset-0 flex items-center justify-center bg-black/65 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="relative mx-4 flex flex-col items-center rounded-3xl border border-neutral-200/80 bg-bg-surface/95 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl dark:border-neutral-800"
                        >
                            {/* Neon Ambient Halo */}
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cobalt/30 via-violet/30 to-cobalt/30 blur-xl opacity-70 pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center">
                                <CyberLoader size="lg" label="Decrypting Vault Route..." />

                                {isStuck && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => window.location.reload()}
                                        className="mt-4 text-[11px] font-semibold text-text-secondary hover:text-cobalt transition-colors underline"
                                    >
                                        Taking longer than usual? Click to reload
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
