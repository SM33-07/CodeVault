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
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.75, 0.95] : [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 0.7], [18, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.7], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 0.7], [0, -60]);

    return (
        <div
            className="relative flex h-[55rem] md:h-[75rem] items-center justify-center p-2 md:p-12 overflow-hidden"
            ref={containerRef}
        >
            <div
                className="relative w-full py-10 md:py-20"
                style={{
                    perspective: "1200px",
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
            }}
            className="relative mx-auto mt-6 md:mt-10 h-[30rem] md:h-[42rem] w-full max-w-5xl rounded-[28px] md:rounded-[36px] border border-neutral-200/80 bg-neutral-900/5 p-2 md:p-4 shadow-[0_20px_70px_rgba(0,0,0,0.12),0_0_50px_rgba(99,102,241,0.1)] backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:shadow-[0_25px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(99,102,241,0.18)]"
        >
            <div className="h-full w-full overflow-hidden rounded-[20px] md:rounded-[28px] bg-white border border-neutral-200/60 shadow-inner dark:bg-neutral-950 dark:border-neutral-800/60">
                {children}
            </div>
        </motion.div>
    );
};
