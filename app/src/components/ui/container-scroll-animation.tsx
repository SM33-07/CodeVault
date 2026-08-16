"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const ContainerScroll = ({
    titleComponent,
    children,
    className,
}: ContainerScrollProps) => {
    return (
        <div
            className="relative flex flex-col items-center justify-center p-2 md:p-8"
        >
            <div className="relative w-full max-w-5xl py-6 md:py-10">
                <div className="mx-auto max-w-5xl text-center px-4">
                    {titleComponent}
                </div>
                <div
                    className="relative mx-auto mt-6 md:mt-8 h-[28rem] sm:h-[34rem] md:h-[40rem] w-full max-w-5xl rounded-[24px] md:rounded-[32px] border border-neutral-200/80 bg-bg-surface/80 p-2 md:p-3.5 shadow-2xl shadow-cobalt/10 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-bg-surface/70 dark:shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.15)]"
                >
                    <div className="h-full w-full overflow-hidden rounded-[18px] md:rounded-[24px] bg-bg-base border border-neutral-200/60 shadow-inner dark:border-neutral-800/60">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Header = ({
    translate,
    titleComponent,
}: {
    translate: MotionValue<number>;
    titleComponent: string | React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="mx-auto max-w-5xl text-center px-4"
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div
            className="relative mx-auto mt-6 md:mt-8 h-[28rem] sm:h-[34rem] md:h-[40rem] w-full max-w-5xl rounded-[24px] md:rounded-[32px] border border-neutral-200/80 bg-bg-surface/80 p-2 md:p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_40px_rgba(59,130,246,0.12)] backdrop-blur-xl dark:border-neutral-800/80 dark:bg-bg-surface/70 dark:shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(59,130,246,0.15)]"
        >
            <div className="h-full w-full overflow-hidden rounded-[18px] md:rounded-[24px] bg-bg-base border border-neutral-200/60 shadow-inner dark:border-neutral-800/60">
                {children}
            </div>
        </div>
    );
};
