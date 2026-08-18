"use client";

import React from "react";
import GridScan from "@/components/ui/GridScan";

export function GlobalBackgroundLayer() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-auto">
            {/* 1. Underlying Atmospheric Ambient Glow (Cobalt & Violet Liquid Underlay) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[12%] right-[4%] h-[680px] w-[680px] rounded-full bg-violet/20 blur-[140px] dark:bg-purple-600/25" />
                <div className="absolute top-[30%] left-[2%] h-[620px] w-[620px] rounded-full bg-cobalt/15 blur-[130px] dark:bg-blue-600/18" />
                <div className="absolute top-[8%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[110px]" />
            </div>

            {/* 2. Pure ReactBits GridScan WebGL Layer */}
            <div className="absolute inset-0 h-full w-full">
                <GridScan
                    sensitivity={0.55}
                    lineThickness={1.1}
                    linesColor="#42345D"
                    gridScale={0.1}
                    scanColor="#8B5CF6"
                    scanOpacity={0.45}
                    enablePost={true}
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                    lineJitter={0.1}
                    scanGlow={0.5}
                    scanSoftness={2}
                    scanDirection="pingpong"
                    scanOnClick={true}
                    enableWebcam={false}
                    showPreview={false}
                    className="w-full h-full"
                />
            </div>

            {/* 3. Content Protection: Calibrated Radial Vignette & Smooth Bottom Transition */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 65% at 50% 35%, rgba(8, 11, 16, 0.4) 0%, rgba(8, 11, 16, 0.1) 50%, transparent 80%)",
                }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg-base via-bg-base/85 to-transparent" />


        </div>
    );
}

export default GlobalBackgroundLayer;
