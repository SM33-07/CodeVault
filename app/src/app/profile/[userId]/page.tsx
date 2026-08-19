"use client";

import React, { useState, useEffect, use } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Calendar,
    Code2,
    Eye,
    Star,
    GitFork,
    Edit3,
    Lock,
    Globe,
    Copy,
    Check,
    Shield,
    Sparkles,
    Share2,
    UserPlus,
    UserCheck,
    Download,
    X,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { Snippet } from "@/types";
import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";
import { BodyBackgroundLayer } from "@/components/landing/BodyBackgroundLayer";
import { CyberLoader } from "@/components/ui/CyberLoader";
import {
    getStoredForks,
    getStoredSnippets,
    isForkSnippet,
    saveStoredFork,
} from "@/lib/vault-storage";

function GithubIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
    return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

export default function UserProfilePage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { token, user: currentUser, setAuth } = useAuthStore();

    const [profile, setProfile] = useState<any | null>(null);
    const [snippets, setSnippets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [activeTab, setActiveTab] = useState<"all" | "starred" | "forks">("all");
    const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

    // Edit Profile Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDisplayName, setEditDisplayName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editGithub, setEditGithub] = useState("");
    const [editWebsite, setEditWebsite] = useState("");

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [vaultVersion, setVaultVersion] = useState(0);

    useEffect(() => {
        const onVaultUpdated = () => setVaultVersion((v) => v + 1);
        window.addEventListener("codevault-vault-updated", onVaultUpdated);
        return () => window.removeEventListener("codevault-vault-updated", onVaultUpdated);
    }, []);

    const isOwnProfile = Boolean(
        currentUser?.id &&
        (currentUser.id === resolvedParams.userId || resolvedParams.userId === "me")
    );

    useEffect(() => {
        if (isEditModalOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
            };
        }
    }, [isEditModalOpen]);

    useEffect(() => {
        let isMounted = true;

        async function loadProfileAndSnippets() {
            setIsLoading(true);
            try {
                const targetId =
                    resolvedParams.userId === "me" && currentUser?.id
                        ? currentUser.id
                        : resolvedParams.userId;

                const savedFollowers = localStorage.getItem(`codevault_followers_${targetId}`);
                const isSavedFollowing = localStorage.getItem(`codevault_following_${targetId}`) === "true";
                if (isMounted) {
                    setIsFollowing(isSavedFollowing);
                }

                const [userData, userSnippets] = await Promise.all([
                    apiGet<any>(`/api/users/${targetId}`, token ?? undefined).catch(() => null),
                    apiGet<any[]>(`/api/users/${targetId}/snippets`, token ?? undefined).catch(() => null),
                ]);

                if (isMounted) {
                    if (userData) {
                        setProfile(userData);
                        setEditDisplayName(userData.displayName || "");
                        setEditBio(userData.bio || "");
                        setEditGithub(userData.github || currentUser?.githubUsername || "");
                        setEditWebsite(userData.website || currentUser?.websiteUrl || "");
                        setFollowersCount(savedFollowers ? parseInt(savedFollowers, 10) : (userData.followersCount ?? 0));
                    } else {
                        const fallback = {
                            id: targetId,
                            displayName: currentUser?.displayName || (currentUser?.email ? currentUser.email.split("@")[0] : "Developer"),
                            email: currentUser?.email || "developer@codevault.dev",
                            bio: currentUser?.bio || "CodeVault developer & snippet curator.",
                            createdAt: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Active Member",
                            github: currentUser?.githubUsername || "",
                            website: currentUser?.websiteUrl || "",
                            followersCount: 0,
                        };
                        setProfile(fallback);
                        setEditDisplayName(fallback.displayName);
                        setEditBio(fallback.bio);
                        setEditGithub(fallback.github);
                        setEditWebsite(fallback.website);
                        setFollowersCount(savedFollowers ? parseInt(savedFollowers, 10) : 0);
                    }

                    // Retrieve stored forks and snippets to merge
                    const localForks = getStoredForks(targetId);
                    const localUserSnippets = getStoredSnippets(targetId);

                    const map = new Map<string, any>();
                    // Add server snippets if available
                    if (Array.isArray(userSnippets)) {
                        for (const s of userSnippets) map.set(s.id, s);
                    }
                    // Overlay local user snippets and forks
                    for (const s of localUserSnippets) map.set(s.id, s);
                    for (const f of localForks) map.set(f.id, f);

                    let combinedSnippets = Array.from(map.values());
                    if (combinedSnippets.length === 0 && !isOwnProfile) {
                        combinedSnippets = SAMPLE_SNIPPETS;
                    }

                    setSnippets(combinedSnippets);
                }
            } catch (err) {
                if (isMounted) {
                    const fallback = {
                        id: resolvedParams.userId,
                        displayName: currentUser?.displayName || "Developer",
                        email: currentUser?.email || "developer@codevault.dev",
                        bio: currentUser?.bio || "CodeVault developer & snippet curator.",
                        createdAt: "Active Member",
                        github: currentUser?.githubUsername || "",
                        website: currentUser?.websiteUrl || "",
                        followersCount: 0,
                    };
                    setProfile(fallback);
                    setEditDisplayName(fallback.displayName);
                    setEditBio(fallback.bio);
                    setEditGithub(fallback.github);
                    setEditWebsite(fallback.website);
                    
                    const localForks = getStoredForks(resolvedParams.userId);
                    const localUserSnippets = getStoredSnippets(resolvedParams.userId);
                    const map = new Map<string, any>();
                    for (const ls of localUserSnippets) map.set(ls.id, ls);
                    for (const lf of localForks) map.set(lf.id, lf);
                    let combined = Array.from(map.values());
                    if (combined.length === 0 && !isOwnProfile) {
                        combined = SAMPLE_SNIPPETS;
                    }
                    setSnippets(combined);
                    setFollowersCount(0);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadProfileAndSnippets();

        const handleVaultUpdate = () => {
            loadProfileAndSnippets();
        };
        window.addEventListener("codevault-vault-updated", handleVaultUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener("codevault-vault-updated", handleVaultUpdate);
        };
    }, [resolvedParams.userId, currentUser, token, isOwnProfile]);

    const handleCopy = (code: string, id: string, title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success(`Copied "${title}" to clipboard!`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleToggleStar = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setStarredIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                toast.info("Removed from favorites");
            } else {
                next.add(id);
                toast.success("Added to favorites!");
            }
            return next;
        });
    };

    const handleFork = async (snippet: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser?.id && !token) {
            toast.info("Please sign in to save this fork to your personal vault");
            router.push(`/login?redirect=/profile/${resolvedParams.userId}`);
            return;
        }

        try {
            const res = await apiPost<any>(
                `/api/snippets/${snippet.id}/fork`,
                {},
                token ?? undefined
            ).catch(() => null);

            const forkedData = res || {
                id: `fork-${Date.now()}`,
                title: `${snippet.title} (Fork)`,
                description: `Forked from ${snippet.title}. Lineage preserved.`,
                language: snippet.language || "TypeScript",
                langColor: snippet.langColor,
                code: snippet.code || snippet.codeBody || "",
                codeBody: snippet.codeBody || snippet.code || "",
                codePreview: snippet.codePreview,
                tags: Array.isArray(snippet.tags) ? (snippet.tags.includes("forked") ? snippet.tags : [...snippet.tags, "forked"]) : ["forked"],
                forkCount: 0,
                viewCount: 1,
                isPrivate: false,
                forkedFromId: snippet.id,
                forkedFromTitle: snippet.title,
                isFork: true,
                createdAt: new Date().toISOString(),
                ownerId: currentUser?.id || "me",
                author: {
                    name: currentUser?.displayName || "You",
                    handle: `@${currentUser?.displayName?.toLowerCase().replace(/\s+/g, "") || "developer"}`,
                },
                gradientTheme: snippet.gradientTheme,
            };

            saveStoredFork(forkedData);
            setSnippets((prev) => [forkedData, ...prev.filter((s) => s.id !== forkedData.id)]);
            toast.success(`Forked "${snippet.title}" to your vault with lineage provenance!`);
        } catch (err: any) {
            toast.error(err?.message || "Failed to fork snippet");
        }
    };

    const handleToggleFollow = () => {
        const targetId = resolvedParams.userId === "me" && currentUser?.id ? currentUser.id : resolvedParams.userId;
        setIsFollowing((prev) => {
            const next = !prev;
            const newCount = Math.max(0, followersCount + (next ? 1 : -1));
            setFollowersCount(newCount);
            localStorage.setItem(`codevault_following_${targetId}`, String(next));
            localStorage.setItem(`codevault_followers_${targetId}`, String(newCount));
            toast.success(next ? `Now following ${displayName}` : `Unfollowed ${displayName}`);
            return next;
        });
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const updated = {
            ...profile,
            displayName: editDisplayName,
            bio: editBio,
        };
        setProfile(updated);

        if (currentUser) {
            setAuth(token || "token", {
                ...currentUser,
                displayName: editDisplayName,
                bio: editBio,
            });
        }

        try {
            if (currentUser?.id) {
                await apiPut(`/api/users/${currentUser.id}`, { displayName: editDisplayName, bio: editBio }, token ?? undefined);
            }
        } catch {
            // offline fallback
        }

        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
    };

    const handleExportSnippets = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snippets, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${displayName.toLowerCase().replace(/\s+/g, "-")}-snippets.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success(`Exported ${snippets.length} snippets to JSON!`);
    };

    if (isLoading) {
        return (
            <CyberLoader
                fullscreen
                size="lg"
                label="Loading Developer Profile..."
                subtitle="Fetching user repository badges & stats..."
            />
        );
    }

    const displayName = profile?.displayName || profile?.email?.split("@")[0] || "Developer";
    const totalViews = snippets.reduce((acc, s) => acc + (s.viewCount || 0), 0);
    const forkedSnippetsCount = snippets.filter(isForkSnippet).length;
    const totalForks = snippets.reduce((acc, s) => acc + (s.forkCount || 0), 0) + forkedSnippetsCount;

    const filteredSnippets = snippets.filter((s) => {
        if (activeTab === "starred") return starredIds.has(s.id);
        if (activeTab === "forks") return isForkSnippet(s);
        return true;
    });

    return (
        <div className="relative min-h-screen bg-bg-base pt-4 pb-12 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Living Midnight Grainient + Blueprint Matrix Shader */}
            <BodyBackgroundLayer isFixed />

            <div className="relative z-10 mx-auto max-w-5xl space-y-8">
                {/* Profile Header Banner */}
                <div className="rounded-3xl border border-neutral-200/80 bg-bg-surface/90 backdrop-blur-xl p-6 sm:p-8 shadow-xs dark:border-neutral-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cobalt to-violet text-2xl sm:text-3xl font-extrabold text-white shadow-lg shadow-cobalt/20">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-text-primary">
                                        {displayName}
                                    </h1>
                                    {isOwnProfile && (
                                        <span className="rounded-full bg-cobalt/15 border border-cobalt/30 px-2.5 py-0.5 text-[11px] font-semibold text-cobalt">
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-text-secondary">
                                    {profile?.email}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{profile?.createdAt || "Joined 2026"}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{followersCount} Followers</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {isOwnProfile ? (
                                <>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cobalt/20 hover:bg-cobalt-hover active:scale-95 transition-all"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button
                                        onClick={handleExportSnippets}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-bg-elevated px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-all shadow-xs"
                                        title="Export all profile snippets"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Export</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleToggleFollow}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all ${
                                        isFollowing
                                            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                            : "bg-cobalt text-white hover:bg-cobalt-hover"
                                    }`}
                                >
                                    {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                                    <span>{isFollowing ? "Following" : "Follow"}</span>
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Profile URL copied to clipboard!");
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-bg-elevated px-3.5 py-2 text-xs font-semibold text-text-primary dark:border-neutral-800 hover:border-cobalt hover:text-cobalt transition-all shadow-xs"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                        <p className="text-sm text-text-primary leading-relaxed max-w-2xl">
                            {profile?.bio || "No biography provided yet."}
                        </p>

                        {/* Social Links */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
                            <a
                                href={`https://github.com/${editGithub}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-cobalt transition-colors"
                            >
                                <GithubIcon className="h-3.5 w-3.5" />
                                <span>github/{editGithub}</span>
                            </a>
                            <a
                                href={editWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-cobalt transition-colors"
                            >
                                <Globe className="h-3.5 w-3.5" />
                                <span>{editWebsite.replace("https://", "")}</span>
                            </a>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 text-xs">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-cobalt" />
                            <span className="text-text-secondary">
                                <strong className="text-text-primary font-bold">
                                    {snippets.length}
                                </strong>{" "}
                                Snippets
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-mint" />
                            <span className="text-text-secondary">
                                <strong className="text-text-primary font-bold">
                                    {totalViews}
                                </strong>{" "}
                                Total Views
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GitFork className="h-4 w-4 text-violet" />
                            <span className="text-text-secondary">
                                <strong className="text-text-primary font-bold">
                                    {totalForks}
                                </strong>{" "}
                                Fork Tree
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Verified Developer</span>
                        </div>
                    </div>
                </div>

                {/* Public Snippets Tabs & List */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-text-primary">
                            {isOwnProfile ? "Personal Vault & Snippets" : "Published Snippets"}
                        </h2>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 rounded-xl bg-bg-elevated p-1 border border-neutral-200/60 dark:border-neutral-800">
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                    activeTab === "all"
                                        ? "bg-bg-surface text-text-primary shadow-xs"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                All ({snippets.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("starred")}
                                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                    activeTab === "starred"
                                        ? "bg-bg-surface text-text-primary shadow-xs"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                <Star className="h-3 w-3 text-amber-500" />
                                <span>Favorites ({starredIds.size})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("forks")}
                                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                    activeTab === "forks"
                                        ? "bg-bg-surface text-violet shadow-xs font-bold"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                <GitFork className="h-3 w-3 text-violet" />
                                <span>Fork Lineage ({forkedSnippetsCount})</span>
                            </button>
                        </div>
                    </div>

                    {filteredSnippets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300/80 dark:border-neutral-800 bg-bg-surface/50 p-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet mb-3">
                                <GitFork className="h-6 w-6" />
                            </div>
                            <h3 className="text-base font-semibold text-text-primary">
                                {activeTab === "forks"
                                    ? "No forked snippets found"
                                    : activeTab === "starred"
                                        ? "No favorite snippets yet"
                                        : "No snippets in this vault yet"}
                            </h3>
                            <p className="mt-1 text-xs text-text-secondary max-w-sm">
                                {activeTab === "forks"
                                    ? "Fork public snippets from other developers to track provenance and keep your personal versions."
                                    : "Explore public snippets and fork them into your vault."}
                            </p>
                            <Link
                                href="/snippets"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cobalt/20 hover:bg-cobalt-hover transition-all"
                            >
                                <span>Explore Snippets</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSnippets.map((snippet) => {
                                const codeStr = snippet.codeBody || snippet.code || "";
                                const snippetTitle = snippet.title || "Snippet";
                                const langName = snippet.language || "Code";
                                const isFork = isForkSnippet(snippet);

                                return (
                                    <motion.div
                                        key={snippet.id}
                                        whileHover={{ y: -4 }}
                                        className={`group relative flex flex-col justify-between rounded-2xl border bg-bg-surface/90 backdrop-blur-xl p-5 shadow-xs transition-all duration-300 ${
                                            isFork
                                                ? "border-violet/40 hover:border-violet/80 shadow-violet/5 dark:border-violet/30 dark:hover:border-violet/60"
                                                : "border-neutral-200/80 hover:border-cobalt/60 dark:border-neutral-800"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-md bg-bg-elevated border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-text-primary">
                                                        {langName}
                                                    </span>
                                                    {isFork ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 border border-violet/30 px-2.5 py-0.5 text-[10px] font-semibold text-violet">
                                                            <GitFork className="h-3 w-3" />
                                                            <span>Forked</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 badge-mint rounded-full px-2 py-0.5 text-[10px] font-semibold">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span>{snippet.isPrivate || snippet.visibility === "private" ? "Private" : "Public"}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => handleToggleStar(snippet.id, e)}
                                                        className={`p-1 rounded transition-colors ${
                                                            starredIds.has(snippet.id) ? "text-amber-400" : "text-text-secondary hover:text-amber-400"
                                                        }`}
                                                        title="Favorite"
                                                    >
                                                        <Star className={`h-3.5 w-3.5 ${starredIds.has(snippet.id) ? "fill-amber-400" : ""}`} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleFork(snippet, e)}
                                                        className="p-1 text-text-secondary hover:text-violet transition-colors"
                                                        title="Fork Snippet"
                                                    >
                                                        <GitFork className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) =>
                                                            handleCopy(codeStr, snippet.id, snippetTitle, e)
                                                        }
                                                        className="p-1 text-text-secondary hover:text-text-primary"
                                                        title="Copy Code"
                                                    >
                                                        {copiedId === snippet.id ? (
                                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <Link href={`/snippets/${snippet.id}`} className="block mt-2">
                                                <h3 className="text-sm font-bold text-text-primary group-hover:text-cobalt transition-colors line-clamp-1">
                                                    {snippetTitle}
                                                </h3>
                                                {snippet.forkedFromId && (
                                                    <p className="text-[11px] font-medium text-violet flex items-center gap-1 mt-0.5">
                                                        <GitFork className="h-3 w-3" />
                                                        <span>
                                                            {snippet.forkedFromTitle ? `Fork of ${snippet.forkedFromTitle}` : "Forked with Lineage"}
                                                        </span>
                                                    </p>
                                                )}
                                                <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                                                    {snippet.description || "Reusable snippet"}
                                                </p>
                                            </Link>

                                            <div className="mt-3 overflow-hidden rounded-xl bg-bg-base border border-neutral-800 p-2.5 font-mono text-[11px] text-text-primary">
                                                <pre className="line-clamp-3">{codeStr}</pre>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-text-secondary">
                                            <span>{snippet.viewCount || 0} views • {snippet.forkCount || 0} forks</span>
                                            <Link
                                                href={`/snippets/${snippet.id}`}
                                                className="font-semibold text-cobalt hover:underline flex items-center gap-1"
                                            >
                                                <span>Inspect</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditModalOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 10, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-bg-surface p-6 shadow-2xl dark:border-neutral-800 z-10 my-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cobalt text-white shadow-md">
                                            <Edit3 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-text-primary">
                                                Edit Profile
                                            </h3>
                                            <p className="text-xs text-text-secondary">
                                                Update your public developer identity.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-elevated"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editDisplayName}
                                            onChange={(e) => setEditDisplayName(e.target.value)}
                                            required
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-text-primary mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            placeholder="What are you building?"
                                            className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1">
                                                GitHub Username
                                            </label>
                                            <input
                                                type="text"
                                                value={editGithub}
                                                onChange={(e) => setEditGithub(e.target.value)}
                                                placeholder="e.g. octocat"
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-text-primary mb-1">
                                                Website URL
                                            </label>
                                            <input
                                                type="url"
                                                value={editWebsite}
                                                onChange={(e) => setEditWebsite(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full rounded-xl border border-neutral-200 bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-cobalt dark:border-neutral-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-xl bg-cobalt px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-cobalt-hover active:scale-95 transition-all"
                                        >
                                            Save Profile
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
