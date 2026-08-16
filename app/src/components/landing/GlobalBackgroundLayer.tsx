"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitFork, Code2, Shield, Sparkles, Terminal, Copy, Check, Lock } from "lucide-react";
import { toast } from "sonner";

export function GlobalBackgroundLayer() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    const handleCopy = (id: string, text: string, label: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success(`Copied snippet: ${label}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        setRipples((prev) => [...prev.slice(-4), newRipple]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1200);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const parent = canvas.parentElement;
        let width = (canvas.width = parent?.clientWidth || window.innerWidth);
        let height = (canvas.height = parent?.clientHeight || window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            const p = canvas.parentElement;
            width = canvas.width = p?.clientWidth || window.innerWidth;
            height = canvas.height = p?.clientHeight || window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Smooth cursor tracking
        let mouseX = width * 0.5;
        let mouseY = height * 0.3;
        let curX = mouseX;
        let curY = mouseY;

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        let time = 0;

        const render = () => {
            time += 0.008;
            ctx.clearRect(0, 0, width, height);

            curX += (mouseX - curX) * 0.04;
            curY += (mouseY - curY) * 0.04;

            const tiltX = (curX / width - 0.5) * 2;
            const tiltY = (curY / height - 0.5) * 2;

            // 1. Dynamic Mesh Gradient Volumetric Auras
            ctx.save();
            ctx.globalCompositeOperation = "screen";

            // Top-Right Deep Violet Aura
            const vX = width * 0.82 + Math.cos(time * 0.4) * 45 + tiltX * 30;
            const vY = height * 0.16 + Math.sin(time * 0.35) * 35 + tiltY * 20;
            const vGrad = ctx.createRadialGradient(vX, vY, 0, vX, vY, 520);
            vGrad.addColorStop(0, "rgba(124, 58, 237, 0.25)");
            vGrad.addColorStop(0.45, "rgba(124, 58, 237, 0.09)");
            vGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = vGrad;
            ctx.beginPath();
            ctx.arc(vX, vY, 520, 0, Math.PI * 2);
            ctx.fill();

            // Center-Left Cobalt Glow (Reacts dynamically to cursor)
            const cX = width * 0.24 + Math.sin(time * 0.5) * 45 + tiltX * 35;
            const cY = height * 0.22 + Math.cos(time * 0.4) * 35 + tiltY * 25;
            const cGrad = ctx.createRadialGradient(cX, cY, 0, cX, cY, 460);
            cGrad.addColorStop(0, "rgba(59, 130, 246, 0.2)");
            cGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.07)");
            cGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.arc(cX, cY, 460, 0, Math.PI * 2);
            ctx.fill();

            // Bottom-Left Mint / Emerald Aura
            const mX = width * 0.35 + Math.cos(time * 0.6) * 40 + tiltX * 20;
            const mY = height * 0.44 + Math.sin(time * 0.5) * 30 + tiltY * 15;
            const mGrad = ctx.createRadialGradient(mX, mY, 0, mX, mY, 420);
            mGrad.addColorStop(0, "rgba(16, 185, 129, 0.16)");
            mGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.05)");
            mGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = mGrad;
            ctx.beginPath();
            ctx.arc(mX, mY, 420, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

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
        <div
            onClick={handleCanvasClick}
            className="absolute inset-0 z-0 overflow-hidden select-none cursor-crosshair"
        >
            {/* 1. Static Atmospheric Gradient Glow Underlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[6%] right-[3%] h-[680px] w-[680px] rounded-full bg-violet/25 blur-[140px] dark:bg-purple-600/30" />
                <div className="absolute top-[32%] left-[8%] h-[620px] w-[620px] rounded-full bg-mint/20 blur-[130px] dark:bg-emerald-500/22" />
                <div className="absolute top-[4%] left-[4%] h-[520px] w-[520px] rounded-full bg-cobalt/20 blur-[120px] dark:bg-blue-600/20" />
            </div>

            {/* 2. Dynamic Mesh Canvas Atmosphere */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full opacity-95 dark:opacity-90 pointer-events-none"
            />

            {/* 3. High-Definition 1px Blueprint Perspective Grid with Radial Mask */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.11]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #3B82F6 1px, transparent 1px),
                        linear-gradient(to bottom, #7C3AED 1px, transparent 1px)
                    `,
                    backgroundSize: "52px 52px",
                    maskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 35%, transparent 85%)",
                    WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 30%, black 35%, transparent 85%)",
                }}
            />

            {/* 4. Click Ripple Waves */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        style={{
                            left: ripple.x - 40,
                            top: ripple.y - 40,
                        }}
                        className="pointer-events-none absolute h-20 w-20 rounded-full border-2 border-violet/60 shadow-[0_0_25px_rgba(124,58,237,0.6)]"
                    />
                ))}
            </AnimatePresence>

            {/* 5. Smooth Bottom Fade to Flat Obsidian (#080B10) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        </div>
    );
}
