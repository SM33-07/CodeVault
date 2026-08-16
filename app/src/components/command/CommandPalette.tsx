"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Code,
    FileCode,
    Home,
    Lock,
    Moon,
    Plus,
    Search,
    Sun,
    Terminal,
    User,
    Sparkles,
    Copy,
} from "lucide-react";
import { toast } from "sonner";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export function CommandPalette({
    open: externalOpen,
    onOpenChange: setExternalOpen,
}: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = setExternalOpen || setInternalOpen;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return;
                }

                e.preventDefault();
                setIsOpen(!isOpen);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isOpen, setIsOpen]);

    const runCommand = (command: () => void) => {
        setIsOpen(false);
        command();
    };

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput placeholder="Type a command or search snippets (⌘K)..." />
            <CommandList className="max-h-[380px] p-2">
                <CommandEmpty className="py-6 text-center text-xs text-neutral-500">
                    No results found.
                </CommandEmpty>

                {/* Quick Navigation */}
                <CommandGroup heading="Navigation">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <Home className="h-4 w-4 text-text-secondary" />
                        <span>Home</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/dashboard"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <FileCode className="h-4 w-4 text-cobalt" />
                        <span>Dashboard</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/snippets"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <Code className="h-4 w-4 text-mint" />
                        <span>Snippet Library</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/profile/me"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <User className="h-4 w-4 text-violet" />
                        <span>Developer Profile</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/register"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <Plus className="h-4 w-4 text-cobalt" />
                        <span>Create Account / New Vault</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/login"))}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        <User className="h-4 w-4 text-text-secondary" />
                        <span>Sign In</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-1" />

                {/* Snippets Search & Copy */}
                <CommandGroup heading="Quick Copy Snippets">
                    {SAMPLE_SNIPPETS.map((snippet) => (
                        <CommandItem
                            key={snippet.id}
                            onSelect={() =>
                                runCommand(() => {
                                    navigator.clipboard.writeText(snippet.code);
                                    toast.success(`Copied "${snippet.title}"!`);
                                })
                            }
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs cursor-pointer"
                        >
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: snippet.langColor }}
                                />
                                <span className="font-medium text-text-primary">
                                    {snippet.title}
                                </span>
                                <span className="text-[10px] text-text-secondary">
                                    ({snippet.language})
                                </span>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
                                <Copy className="h-3 w-3" />
                                Copy
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator className="my-1" />

                {/* Preferences */}
                <CommandGroup heading="Preferences">
                    <CommandItem
                        onSelect={() =>
                            runCommand(() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            )
                        }
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs cursor-pointer"
                    >
                        {theme === "dark" ? (
                            <>
                                <Sun className="h-4 w-4 text-amber-400" />
                                <span>Switch to Light Theme</span>
                            </>
                        ) : (
                            <>
                                <Moon className="h-4 w-4 text-cobalt" />
                                <span>Switch to Dark Theme</span>
                            </>
                        )}
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
