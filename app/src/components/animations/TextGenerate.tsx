"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

interface TextGenerateProps {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}

export function TextGenerate({
    words,
    className = "",
    filter = true,
    duration = 0.5,
}: TextGenerateProps) {
    const [scope, animate] = useAnimate();
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
            },
            {
                duration: duration ? duration : 1,
                delay: stagger(0.04),
            }
        );
    }, [scope.current, words, animate, duration, filter]);

    return (
        <div className={`font-sans ${className}`}>
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => {
                    return (
                        <motion.span
                            key={word + idx}
                            className="inline-block opacity-0"
                            style={{
                                filter: filter ? "blur(4px)" : "none",
                            }}
                        >
                            {word}&nbsp;
                        </motion.span>
                    );
                })}
            </motion.div>
        </div>
    );
}
