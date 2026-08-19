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
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);
    const [targetPath, setTargetPath] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const startTimeRef = useRef<number>(0);
    const prevPathnameRef = useRef(pathname);

    // Initial site access or reload duration (adequate time for legibility and animation)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, []);

    // When pathname or searchParams change, ensure minimum display duration so animation is legible and complete
    useEffect(() => {
        if (prevPathnameRef.current !== pathname) {
            prevPathnameRef.current = pathname;

            const elapsedTime = Date.now() - startTimeRef.current;
            const minDuration = 1400; // Guaranteed minimum display time for legibility and smooth visual satisfaction
            const remainingTime = Math.max(0, minDuration - elapsedTime);

            setProgress(100);

            const hideTimer = setTimeout(() => {
                setIsNavigating(false);
                setTargetPath(null);
                setTimeout(() => setProgress(0), 300);
            }, remainingTime);

            return () => clearTimeout(hideTimer);
        }
    }, [pathname, searchParams]);

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
                    setTargetPath(targetUrl);
                    setIsNavigating(true);
                    setProgress(35);

                    // Accelerate laser progress bar
                    setTimeout(() => setProgress((p) => (p === 35 ? 75 : p)), 150);
                    setTimeout(() => setProgress((p) => (p === 75 ? 90 : p)), 350);
                }
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleClick, { capture: true });
        };
    }, []);

    const activeInfo = getRouteLoaderInfo(targetPath || pathname);
    const showLoader = isInitialLoading || isNavigating;

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
                            width: { duration: 0.25, ease: "easeOut" },
                            opacity: { duration: 0.25, delay: 0.1 },
                        }}
                        className="h-[3px] bg-gradient-to-r from-cobalt via-violet to-mint shadow-[0_0_15px_rgba(59,130,246,0.9),0_0_25px_rgba(139,92,246,0.7)]"
                    />
                </div>
            )}

            {/* Plain Background Fullscreen CyberLoader on every access, reload, and navigation */}
            <AnimatePresence>
                {showLoader && (
                    <CyberLoader
                        fullscreen
                        size="lg"
                        label={activeInfo.label}
                        subtitle={activeInfo.subtitle}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
