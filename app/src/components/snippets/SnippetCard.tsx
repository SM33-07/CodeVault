"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Check,
    Copy,
    Lock,
    Globe,
    Star,
    Share2,
    Code,
    Sparkles,
    MoreHorizontal,
    Eye,
} from "lucide-react";
import { toast } from "sonner";

export interface SnippetItem {
    id: string;
    title: string;
    description: string;
    language: string;
    langColor: string;
    code: string;
    codePreview: string[];
    tags: string[];
    stars: number;
    copies: number;
    createdAt: string;
    isPrivate?: boolean;
    author: {
        name: string;
        avatar?: string;
        handle: string;
    };
    gradientTheme: {
        glow: string;
        accent: string;
    };
}

interface SnippetCardProps {
    snippet: SnippetItem;
    onTagClick?: (tag: string) => void;
}

export function SnippetCard({ snippet, onTagClick }: SnippetCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [starCount, setStarCount] = useState(snippet.stars);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(snippet.code);
        setIsCopied(true);
        toast.success(`Copied "${snippet.title}" to clipboard!`);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleStar = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isStarred) {
            setStarCount((prev) => prev - 1);
            setIsStarred(false);
        } else {
            setStarCount((prev) => prev + 1);
            setIsStarred(true);
            toast.success(`Starred "${snippet.title}"`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800/90 dark:bg-neutral-900/90 dark:hover:border-neutral-700"
        >
            {/* Top-Right Ambient Corner Gradient (inspired by Course Design Cards) */}
            <div
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ backgroundColor: snippet.gradientTheme.glow }}
            />

            {/* Top Section */}
            <div>
                {/* Header: Date + Language + Action buttons */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                                backgroundColor: `${snippet.langColor}15`,
                                color: snippet.langColor,
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: snippet.langColor }}
                            />
                            {snippet.language}
                        </span>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {snippet.createdAt}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleStar}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                isStarred
                                    ? "text-amber-500 bg-amber-500/10"
                                    : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                            }`}
                            title="Star Snippet"
                        >
                            <Star
                                className={`h-4 w-4 ${
                                    isStarred ? "fill-amber-400 text-amber-400" : ""
                                }`}
                            />
                        </button>

                        <button
                            onClick={handleCopy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                            title="Copy Snippet"
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {snippet.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {snippet.description}
                    </p>
                </div>

                {/* Syntax Peek Box */}
                <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-950 p-3 font-mono text-[11px] leading-relaxed text-neutral-300 shadow-inner dark:border-neutral-800">
                    <div className="space-y-0.5 opacity-90">
                        {snippet.codePreview.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="w-4 select-none text-right text-[10px] text-neutral-600">
                                    {idx + 1}
                                </span>
                                <span className="truncate text-neutral-300">
                                    {line}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                {/* Tag Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {snippet.tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onTagClick?.(tag)}
                            className="rounded-md bg-neutral-100 dark:bg-neutral-800/70 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Author & Status Pill Capsule */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-sm">
                            {snippet.author.name.charAt(0)}
                        </div>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {snippet.author.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {starCount}
                        </span>

                        <span className="flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                            {snippet.isPrivate ? (
                                <>
                                    <Lock className="h-3 w-3 text-indigo-400" />
                                    <span>Private</span>
                                </>
                            ) : (
                                <>
                                    <Globe className="h-3 w-3 text-emerald-400" />
                                    <span>Public</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
