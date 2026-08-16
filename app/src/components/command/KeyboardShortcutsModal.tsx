"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Keyboard, X, Sparkles, Search, Plus, GitFork, Copy, Sun, Shield } from "lucide-react";

interface ShortcutItem {
    keys: string[];
    description: string;
    category: "Navigation" | "Snippet Actions" | "System";
}

const SHORTCUTS: ShortcutItem[] = [
    {
        keys: ["⌘", "K"],
        description: "Universal Fuzzy Search & Command Palette",
        category: "Navigation",
    },
    {
        keys: ["/"],
        description: "Focus Search Bar instantly",
        category: "Navigation",
    },
    {
        keys: ["⌘", "N"],
        description: "Create New Snippet in Vault",
        category: "Snippet Actions",
    },
    {
        keys: ["F"],
        description: "Fork selected snippet with provenance",
        category: "Snippet Actions",
    },
    {
        keys: ["C"],
        description: "Copy snippet code to clipboard",
        category: "Snippet Actions",
    },
    {
        keys: ["L"],
        description: "Inspect Fork Lineage Ancestry Graph",
        category: "Snippet Actions",
    },
    {
        keys: ["?"],
        description: "Toggle this Keyboard Shortcuts HUD",
        category: "System",
    },
    {
        keys: ["ESC"],
        description: "Dismiss active modal or overlay",
        category: "System",
    },
];

export function KeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            if (e.key === "?" && (e.shiftKey || !e.metaKey)) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200/80 bg-bg-surface p-6 shadow-2xl backdrop-blur-2xl dark:border-neutral-800/80 dark:bg-bg-surface/95 z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cobalt/15 text-cobalt border border-cobalt/30 shadow-xs">
                                    <Keyboard className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-text-primary">
                                        Developer Keyboard Shortcuts
                                    </h3>
                                    <p className="text-[11px] text-text-secondary">
                                        Keyboard-first speed for power users
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Shortcuts List */}
                        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            {["Navigation", "Snippet Actions", "System"].map((category) => (
                                <div key={category} className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                        {category}
                                    </span>
                                    <div className="space-y-1.5">
                                        {SHORTCUTS.filter((s) => s.category === category).map((shortcut, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-xl bg-bg-elevated/60 px-3 py-2 text-xs border border-neutral-200/40 dark:border-neutral-800/40"
                                            >
                                                <span className="text-text-primary font-medium">
                                                    {shortcut.description}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {shortcut.keys.map((k, kIdx) => (
                                                        <kbd
                                                            key={kIdx}
                                                            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-bg-surface px-2 py-0.5 font-mono text-[11px] font-bold text-text-primary shadow-xs"
                                                        >
                                                            {k}
                                                        </kbd>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Tip */}
                        <div className="mt-6 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-text-secondary">
                            <span>Press <kbd className="font-mono text-text-primary font-bold">?</kbd> anywhere to toggle</span>
                            <span className="text-cobalt font-semibold">Sub-50ms DX</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
