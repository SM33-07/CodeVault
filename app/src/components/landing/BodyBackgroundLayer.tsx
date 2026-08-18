"use client";

import React from "react";
import Grainient from "@/components/ui/Grainient";

interface BodyBackgroundLayerProps {
    className?: string;
    isFixed?: boolean;
}

export function BodyBackgroundLayer({ className = "", isFixed = false }: BodyBackgroundLayerProps) {
    return (
        <div className={`pointer-events-none ${isFixed ? "fixed" : "absolute"} inset-0 z-0 overflow-hidden select-none ${className}`}>
            {/* 1. Deep Midnight Grainient WebGL Shader */}
            <div className="absolute inset-0 h-full w-full opacity-28 dark:opacity-35">
                <Grainient
                    color1="#2E1260" // Dark Midnight Violet
                    color2="#0C1F4D" // Dark Midnight Cobalt
                    color3="#040609" // Deep Obsidian Black
                    timeSpeed={0.06}
                    colorBalance={-0.3}
                    warpStrength={0.65}
                    warpFrequency={3.2}
                    warpSpeed={1.0}
                    warpAmplitude={30.0}
                    blendAngle={15.0}
                    blendSoftness={0.15}
                    rotationAmount={260.0}
                    noiseScale={1.6}
                    grainAmount={0.03}
                    grainScale={2.0}
                    grainAnimated={false}
                    contrast={1.1}
                    gamma={1.0}
                    saturation={0.75}
                    centerX={0.0}
                    centerY={0.0}
                    zoom={0.95}
                    className="w-full h-full"
                />
            </div>

            {/* 2. Sleek Blueprint Dot Matrix Grid */}
            <div
                className="absolute inset-0 z-10 opacity-18 dark:opacity-25 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(rgba(129, 140, 248, 0.55) 1.1px, transparent 1.1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* 3. Deep Top Blend Zone */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg-base via-bg-base/80 to-transparent pointer-events-none z-10" />

            {/* 4. Deep Bottom Blend Zone */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent pointer-events-none z-10" />
        </div>
    );
}

export default BodyBackgroundLayer;



