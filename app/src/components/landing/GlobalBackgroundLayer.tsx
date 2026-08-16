"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GitFork, Code2, Shield } from "lucide-react";

export function GlobalBackgroundLayer() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        // Check reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Cursor tracking with lerp
        let targetX = width * 0.5;
        let targetY = height * 0.3;
        let cursorX = targetX;
        let cursorY = targetY;

        const handleMouseMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        // Blobs definition
        let time = 0;
        const blobs = [
            {
                // Cobalt interactive blob (reacts to cursor)
                color: "rgba(59, 130, 246, 0.12)",
                radius: 380,
                baseX: width * 0.45,
                baseY: height * 0.25,
            },
            {
                // Violet brand/lineage blob
                color: "rgba(124, 58, 237, 0.09)",
                radius: 420,
                baseX: width * 0.7,
                baseY: height * 0.45,
            },
            {
                // Mint state feedback blob
                color: "rgba(16, 185, 129, 0.06)",
                radius: 340,
                baseX: width * 0.2,
                baseY: height * 0.65,
            },
        ];

        const render = () => {
            time += 0.006;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";

            if (reducedMotion) {
                // Static render for reduced motion
                blobs.forEach((blob, i) => {
                    const gradient = ctx.createRadialGradient(
                        blob.baseX,
                        blob.baseY,
                        0,
                        blob.baseX,
                        blob.baseY,
                        blob.radius
                    );
                    gradient.addColorStop(0, blob.color);
                    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(blob.baseX, blob.baseY, blob.radius, 0, Math.PI * 2);
                    ctx.fill();
                });
                return;
            }

            // Lerp cursor toward target
            cursorX += (targetX - cursorX) * 0.03;
            cursorY += (targetY - cursorY) * 0.03;

            blobs.forEach((blob, i) => {
                let x = blob.baseX;
                let y = blob.baseY;

                if (i === 0) {
                    // Cobalt blob drifts toward cursor
                    x = cursorX + Math.sin(time) * 40;
                    y = cursorY + Math.cos(time * 0.8) * 35;
                } else if (i === 1) {
                    // Violet blob slow harmonic drift
                    x = blob.baseX + Math.cos(time * 0.7) * 80;
                    y = blob.baseY + Math.sin(time * 0.5) * 60;
                } else {
                    // Mint blob gentle circular motion
                    x = blob.baseX + Math.sin(time * 0.9) * 60;
                    y = blob.baseY + Math.cos(time * 0.6) * 50;
                }

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.radius);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, blob.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [reducedMotion]);

    return (
        <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none">
            {/* 1. Canvas Mesh Gradient Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full opacity-90 dark:opacity-80"
            />

            {/* 2. Faint 1px Background Grid with Radial Mask */}
            <div
                className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #3B82F6 1px, transparent 1px),
                        linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
                    `,
                    backgroundSize: "44px 44px",
                    maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)",
                }}
            />

            {/* 3. Scattered Glowing Lineage Network Node Dots */}
            <div className="absolute top-[18%] left-[12%] h-2 w-2 rounded-full bg-cobalt/60 blur-[1px] animate-pulse" style={{ animationDuration: "3.5s" }} />
            <div className="absolute top-[28%] right-[14%] h-2.5 w-2.5 rounded-full bg-violet/70 blur-[1px] animate-pulse" style={{ animationDuration: "4.2s", animationDelay: "1s" }} />
            <div className="absolute top-[52%] left-[8%] h-2 w-2 rounded-full bg-mint/60 blur-[1px] animate-pulse" style={{ animationDuration: "3.8s", animationDelay: "2s" }} />
            <div className="absolute top-[68%] right-[10%] h-2 w-2 rounded-full bg-cobalt/50 blur-[1px] animate-pulse" style={{ animationDuration: "4.8s", animationDelay: "0.5s" }} />
            <div className="absolute top-[82%] left-[18%] h-2.5 w-2.5 rounded-full bg-violet/60 blur-[1px] animate-pulse" style={{ animationDuration: "5s", animationDelay: "1.5s" }} />
            <div className="absolute top-[40%] right-[22%] h-1.5 w-1.5 rounded-full bg-mint/50 blur-[1px] animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "2.5s" }} />

            {/* 4. Floating Code-Fragment Cards (Hero Corners) */}
            <div className="hidden xl:block">
                {/* Floating Card 1: useFork hook (Top-Left) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute top-[14%] left-[3%] z-0 animate-float-1"
                >
                    <div className="rounded-xl border border-neutral-200/60 bg-bg-surface/50 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg backdrop-blur-md dark:border-neutral-800/60 dark:bg-bg-surface/40">
                        <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-neutral-700/40 text-[10px] text-violet">
                            <GitFork className="h-3 w-3" />
                            <span>useFork()</span>
                        </div>
                        <p className="text-text-primary">
                            <span className="text-cobalt">const</span> lineage ={" "}
                            <span className="text-violet">useFork</span>(originId);
                        </p>
                    </div>
                </motion.div>

                {/* Floating Card 2: Git branch command (Top-Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute top-[20%] right-[3%] z-0 animate-float-2"
                >
                    <div className="rounded-xl border border-neutral-200/60 bg-bg-surface/50 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg backdrop-blur-md dark:border-neutral-800/60 dark:bg-bg-surface/40">
                        <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-neutral-700/40 text-[10px] text-cobalt">
                            <Code2 className="h-3 w-3" />
                            <span>git-provenance</span>
                        </div>
                        <p className="text-text-primary">
                            $ cv fork <span className="text-emerald-400">#snip-rbac-01</span>
                        </p>
                    </div>
                </motion.div>

                {/* Floating Card 3: CTE Lineage depth query (Mid-Left) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="absolute top-[62%] left-[2%] z-0 animate-float-3"
                >
                    <div className="rounded-xl border border-neutral-200/60 bg-bg-surface/50 p-2.5 font-mono text-[11px] text-text-secondary shadow-lg backdrop-blur-md dark:border-neutral-800/60 dark:bg-bg-surface/40">
                        <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-neutral-700/40 text-[10px] text-emerald-400">
                            <Shield className="h-3 w-3" />
                            <span>PostgreSQL CTE</span>
                        </div>
                        <p className="text-text-primary">
                            depth: <span className="text-violet font-semibold">3</span>{" "}
                            <span className="text-text-secondary">// parent origin</span>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* 5. Static Grain Texture SVG Noise Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
