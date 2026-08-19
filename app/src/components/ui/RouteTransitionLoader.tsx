"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberLoader } from "./CyberLoader";

function getRouteLoaderInfo(path: string) {
    if (!path || path === "/") {
        return {
            label: "Initializing Sovereign Vault...",
            subtitle: "Decrypting workspace & loading developer assets...",
        };
    }
    if (path.startsWith("/dashboard")) {
        return {
            label: "Synchronizing Workspace & Vault...",
            subtitle: "Decrypting repositories, statistics & activity...",
        };
    }
    if (path === "/snippets/new") {
        return {
            label: "Configuring Code Workspace...",
            subtitle: "Initializing editor environment & syntax parser...",
        };
    }
    if (path.startsWith("/snippets/") && path !== "/snippets") {
        return {
            label: "Decrypting Code Snippet...",
            subtitle: "Parsing syntax tree, provenance & lineage graph...",
        };
    }
    if (path.startsWith("/snippets")) {
        return {
            label: "Indexing Snippet Library...",
            subtitle: "Decrypting code categories & community collections...",
        };
    }
    if (path.startsWith("/profile/settings")) {
        return {
            label: "Accessing Vault Security & Settings...",
            subtitle: "Decrypting user preferences & API tokens...",
        };
    }
    if (path.startsWith("/profile")) {
        return {
            label: "Loading Developer Profile...",
            subtitle: "Fetching user repository badges & stats...",
        };
    }
    if (path.startsWith("/login")) {
        return {
            label: "Authorizing Vault Terminal...",
            subtitle: "Establishing secure encryption session...",
        };
    }
    if (path.startsWith("/register")) {
        return {
            label: "Initializing Security Protocol...",
            subtitle: "Preparing sovereign developer vault enrollment...",
        };
    }
    if (path.startsWith("/auth")) {
        return {
            label: "Authorizing Vault Session...",
            subtitle: "Exchanging cryptographic tokens...",
        };
    }
    return {
        label: "Decrypting Vault Route...",
        subtitle: "Establishing secure encryption session...",
    };
}

export function RouteTransitionLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [targetPath, setTargetPath] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const startTimeRef = useRef<number>(0);
    const prevPathnameRef = useRef(pathname);
    const navSafetyTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Hard ceiling watchdog: absolutely guarantee that the full-screen loader can NEVER stay visible past 1.2 seconds
    const showLoader = isInitialLoading || isNavigating;

    useEffect(() => {
        if (showLoader) {
            const hardWatchdogTimer = setTimeout(() => {
                setIsInitialLoading(false);
                setIsNavigating(false);
                setTargetPath(null);
                setTimeout(() => setProgress(0), 200);
            }, 1200);

            return () => clearTimeout(hardWatchdogTimer);
        }
    }, [showLoader, pathname]);

    // Initial mount safety cleanup
    useEffect(() => {
        const initialSafetyTimer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 600);

        return () => clearTimeout(initialSafetyTimer);
    }, []);

    // When pathname or searchParams change, dismiss navigation state promptly
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;
            setProgress(100);

            if (navSafetyTimerRef.current) {
                clearTimeout(navSafetyTimerRef.current);
                navSafetyTimerRef.current = null;
            }

            const hideTimer = setTimeout(() => {
                setIsNavigating(false);
                setTargetPath(null);
                setTimeout(() => setProgress(0), 250);
            }, 400);

            return () => clearTimeout(hideTimer);
        }
    }, [pathname, searchParams]);

    // Intercept internal link clicks to trigger top laser bar & transition
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
                    setTargetPath(targetUrl);
                    setIsNavigating(true);
                    setProgress(40);

                    // Accelerate laser progress bar
                    setTimeout(() => setProgress((p) => (p > 0 ? 80 : p)), 100);

                    // Safety timeout specifically for this click in case route navigation is aborted or unchanged
                    if (navSafetyTimerRef.current) {
                        clearTimeout(navSafetyTimerRef.current);
                    }
                    navSafetyTimerRef.current = setTimeout(() => {
                        setIsNavigating(false);
                        setTargetPath(null);
                        setTimeout(() => setProgress(0), 200);
                    }, 1200);
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
            if (navSafetyTimerRef.current) {
                clearTimeout(navSafetyTimerRef.current);
            }
        };
    }, []);

    const activeInfo = getRouteLoaderInfo(targetPath || pathname);

    return (
        <>
            {/* Top Laser Lightning Progress Bar */}
            {progress > 0 && (
                <div className="fixed top-0 left-0 right-0 z-[1000000] pointer-events-none">
                    <motion.div
                        initial={{ width: "0%", opacity: 1 }}
                        animate={{
                            width: showLoader ? `${progress}%` : "100%",
                            opacity: progress === 100 ? [1, 0] : 1,
                        }}
                        transition={{
                            width: { duration: 0.2, ease: "easeOut" },
                            opacity: { duration: 0.2, delay: 0.05 },
                        }}
                        className="h-[3px] bg-gradient-to-r from-cobalt via-violet to-mint shadow-[0_0_15px_rgba(59,130,246,0.9),0_0_25px_rgba(139,92,246,0.7)]"
                    />
                </div>
            )}

            {/* Plain Background Fullscreen CyberLoader on route transitions with click-to-dismiss */}
            <AnimatePresence>
                {showLoader && (
                    <div
                        onClick={() => {
                            setIsInitialLoading(false);
                            setIsNavigating(false);
                            setTargetPath(null);
                        }}
                        className="fixed inset-0 z-[999999] cursor-pointer"
                        title="Click to dismiss loader"
                    >
                        <CyberLoader
                            fullscreen
                            size="lg"
                            label={activeInfo.label}
                            subtitle={activeInfo.subtitle}
                        />
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
