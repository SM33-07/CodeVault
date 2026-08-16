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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.75, 0.9] : [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div
            ref={containerRef}
            className={`h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20 ${className || ""}`}
        >
            <div
                className="py-10 md:py-40 w-full relative"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card rotate={rotate} translate={translate} scale={scale}>
                    {children}
                </Card>
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
    rotate,
    scale,
    children,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                boxShadow:
                    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            }}
            className="relative mx-auto -mt-8 md:-mt-12 h-[28rem] sm:h-[34rem] md:h-[40rem] w-full max-w-5xl rounded-[24px] md:rounded-[32px] border border-neutral-200/80 bg-bg-surface/80 p-2 md:p-3.5 shadow-2xl backdrop-blur-xl dark:border-neutral-800/80 dark:bg-bg-surface/80 dark:shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(59,130,246,0.15)]"
        >
            <div className="h-full w-full overflow-hidden rounded-[18px] md:rounded-[24px] bg-bg-base border border-neutral-200/60 shadow-inner dark:border-neutral-800/60">
                {children}
            </div>
        </motion.div>
    );
};
