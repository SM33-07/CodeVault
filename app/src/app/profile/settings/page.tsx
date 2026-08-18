"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User, Shield, Check, Loader2, Sparkles, Key, Globe, Download } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiPut } from "@/lib/api";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { token, user, setAuth, isAuthenticated } = useAuthStore();

    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [githubHandle, setGithubHandle] = useState("SM33-07");
    const [websiteUrl, setWebsiteUrl] = useState("https://trycodevault.vercel.app");
    const [geminiApiKey, setGeminiApiKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem("codevault_gemini_key");
        if (storedKey) setGeminiApiKey(storedKey);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (geminiApiKey.trim()) {
            localStorage.setItem("codevault_gemini_key", geminiApiKey.trim());
        }

        try {
            if (user?.id) {
                await apiPut<any>(
                    `/api/users/${user.id}`,
                    { displayName, bio },
                    token ?? undefined
                );
            }

            if (user) {
                setAuth(token || "demo-token", {
                    ...user,
                    displayName,
                    bio,
                });
            }

            toast.success("Profile & preferences updated successfully!");
            router.push(`/profile/${user?.id || "me"}`);
        } catch (err: any) {
            if (user) {
                setAuth(token || "demo-token", {
                    ...user,
                    displayName,
                    bio,
                });
            }
            toast.success("Preferences saved!");
            router.push(`/profile/${user?.id || "me"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-bg-base pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Living Midnight Grainient + Blueprint Matrix Shader */}
            <BodyBackgroundLayer isFixed />

            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-cobalt transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-8 shadow-xs dark:border-neutral-800">
                    <div className="flex items-center gap-3 pb-6 border-b border-neutral-200/60 dark:border-neutral-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt/15 text-cobalt">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-text-primary">
                                Profile Settings
                            </h1>
                            <p className="text-xs text-text-secondary">
                                Customize your public identity, social links, and AI preferences.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || "developer@codevault.dev"}
                                disabled
                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated/50 px-3.5 py-2.5 text-xs text-text-secondary dark:border-neutral-800 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name or developer handle"
                                maxLength={50}
                                required
                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
                                    <GithubIcon className="h-3.5 w-3.5" />
                                    <span>GitHub Username</span>
                                </label>
                                <input
                                    type="text"
                                    value={githubHandle}
                                    onChange={(e) => setGithubHandle(e.target.value)}
                                    placeholder="e.g. SM33-07"
                                    className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
                                    <Globe className="h-3.5 w-3.5" />
                                    <span>Website URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-primary mb-1.5">
                                Short Biography (Max 500 characters)
                            </label>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a short summary about your engineering stack, projects, or interests..."
                                maxLength={500}
                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated p-3.5 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                            />
                            <p className="mt-1 text-right text-[10px] text-text-secondary">
                                {bio.length}/500
                            </p>
                        </div>

                        {/* Optional AI Explanations Key */}
                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-elevated/70 p-4 dark:border-neutral-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-cobalt" />
                                    <span>Personal Gemini AI Key (Optional)</span>
                                </label>
                                <span className="text-[10px] text-text-secondary">
                                    Stored locally in browser
                                </span>
                            </div>
                            <input
                                type="password"
                                value={geminiApiKey}
                                onChange={(e) => setGeminiApiKey(e.target.value)}
                                placeholder="AIzaSy... (leave blank to use server key)"
                                className="w-full rounded-xl border border-neutral-200 bg-bg-base font-mono px-3.5 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                            />
                            <p className="text-[10px] text-text-secondary">
                                Used to power on-demand AI snippet breakdowns and architecture summaries.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                            <Link
                                href="/dashboard"
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 rounded-xl bg-cobalt px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:bg-cobalt-active active:scale-95 transition-all"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
