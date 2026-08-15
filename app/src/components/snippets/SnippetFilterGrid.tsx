"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, Code2, Plus } from "lucide-react";
import { SnippetCard, SnippetItem } from "./SnippetCard";

export const SAMPLE_SNIPPETS: SnippetItem[] = [
    {
        id: "snip-1",
        title: "OAuth 2.0 PKCE & State Token Exchange Service",
        description: "Zero-dependency server-side OAuth exchange logic with Google email_verified gatekeeping and GitHub verified primary email resolution.",
        language: "TypeScript",
        langColor: "#3178C6",
        code: `export async function handleGoogleCallback(code: string, redirectUri: string) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: \`Bearer \${tokens.access_token}\` },
  });
  const googleUser = await userRes.json();
  if (!googleUser.email || !googleUser.email_verified) {
    throw new Error("Google account email is not verified.");
  }
  return upsertOAuthUser({ email: googleUser.email, provider: "google" });
}`,
        codePreview: [
            "export async function handleGoogleCallback(code, redirectUri) {",
            "  const tokens = await exchangeGoogleAuthCode(code, redirectUri);",
            "  const user = await fetchGoogleUserInfo(tokens.access_token);",
            "  if (!user.email_verified) throw new Error(\"Unverified email\");",
        ],
        tags: ["#auth", "#oauth2", "#security", "#typescript"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3178C6", accent: "from-blue-500/20" },
    },
    {
        id: "snip-2",
        title: "Zustand Session Store with SSR Hydration Safety",
        description: "Custom Zustand authentication hook with session persistence, local storage sync, and hydration lifecycle guards.",
        language: "TypeScript",
        langColor: "#3178C6",
        code: `import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: "codevault-session" }
  )
);`,
        codePreview: [
            "export const useAuthStore = create<AuthState>()(",
            "  persist(",
            "    (set) => ({ user: null, token: null, isAuthenticated: false }),",
            "    { name: \"codevault-session\" }",
        ],
        tags: ["#react", "#zustand", "#auth", "#state"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#6366F1", accent: "from-indigo-500/20" },
    },
    {
        id: "snip-3",
        title: "Framer Motion SVG Lineage PathLength Animator",
        description: "Dynamic SVG cubic bezier curve animation tracing provenance between original snippet roots and child forks.",
        language: "TypeScript",
        langColor: "#3178C6",
        code: `<motion.path
  d="M 400 0 C 400 50, 160 50, 160 100"
  fill="none"
  stroke="url(#lineageGlow)"
  strokeWidth="2.5"
  strokeDasharray="4 2"
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
/>`,
        codePreview: [
            "<motion.path",
            "  d=\"M 400 0 C 400 50, 160 50, 160 100\"",
            "  stroke=\"#E0A458\" strokeWidth=\"2.5\"",
            "  animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />",
        ],
        tags: ["#framer-motion", "#svg", "#lineage", "#animations"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#E0A458", accent: "from-amber-500/20" },
    },
    {
        id: "snip-4",
        title: "FastAPI Async Token-Bucket Rate Limiter Guard",
        description: "High-performance Redis token-bucket middleware with non-blocking atomic evaluation and custom 429 detail payload.",
        language: "Python",
        langColor: "#3776AB",
        code: `@app.middleware("http")
async def rate_limit_jwt_guard(request: Request, call_next):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    user_id = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])["sub"]
    is_allowed = await redis_client.evalsha(TOKEN_BUCKET_SHA, 1, f"ratelimit:{user_id}", 60, 1)
    if not is_allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in 60s.")
    return await call_next(request)`,
        codePreview: [
            "@app.middleware(\"http\")",
            "async def rate_limit_jwt_guard(request: Request, call_next):",
            "    user_id = decode_jwt(request.headers.get(\"Authorization\"))",
            "    if not await check_rate_limit(user_id): raise 429",
        ],
        tags: ["#fastapi", "#python", "#redis", "#security"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3776AB", accent: "from-sky-500/20" },
    },
    {
        id: "snip-5",
        title: "Postgres Recursive Fork Lineage Ancestry CTE",
        description: "Hierarchical SQL query using recursive Common Table Expressions to traverse multi-generational snippet fork trees.",
        language: "SQL",
        langColor: "#336791",
        code: `WITH RECURSIVE SnippetLineage AS (
  SELECT id, title, forked_from_id, user_id, 0 AS depth
  FROM snippets
  WHERE id = $1
  UNION ALL
  SELECT s.id, s.title, s.forked_from_id, s.user_id, sl.depth + 1
  FROM snippets s
  INNER JOIN SnippetLineage sl ON s.id = sl.forked_from_id
)
SELECT * FROM SnippetLineage ORDER BY depth DESC;`,
        codePreview: [
            "WITH RECURSIVE SnippetLineage AS (",
            "  SELECT id, title, forked_from_id, 0 AS depth FROM snippets",
            "  UNION ALL",
            "  SELECT s.id, s.title, sl.depth + 1 FROM snippets s JOIN ...",
        ],
        tags: ["#postgres", "#sql", "#lineage", "#database"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#336791", accent: "from-indigo-500/20" },
    },
    {
        id: "snip-6",
        title: "Tokio Async Semaphore Concurrency Worker Pool",
        description: "Zero-allocation concurrent bounded worker pool using Tokio permits and cancellation-safe async joins in Rust.",
        language: "Rust",
        langColor: "#DEA584",
        code: `use std::sync::Arc;
use tokio::sync::Semaphore;

pub struct AsyncWorkerPool {
    sem: Arc<Semaphore>,
}

impl AsyncWorkerPool {
    pub fn new(concurrency: usize) -> Self {
        Self { sem: Arc::new(Semaphore::new(concurrency)) }
    }

    pub async fn spawn<F, T>(&self, task: F) -> T 
    where
        F: std::future::Future<Output = T> + Send + 'static,
        T: Send + 'static,
    {
        let permit = self.sem.clone().acquire_owned().await.unwrap();
        let handle = tokio::spawn(async move {
            let res = task.await;
            drop(permit);
            res
        });
        handle.await.unwrap()
    }
}`,
        codePreview: [
            "pub struct AsyncWorkerPool { sem: Arc<Semaphore> }",
            "impl AsyncWorkerPool {",
            "    pub async fn spawn<F, T>(&self, task: F) -> T {",
            "        let permit = self.sem.clone().acquire_owned().await;",
        ],
        tags: ["#rust", "#tokio", "#concurrency", "#async"],
        forkCount: 0,
        viewCount: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#DEA584", accent: "from-orange-500/20" },
    },
];

const LANGUAGES = [
    { name: "All", count: 6 },
    { name: "TypeScript", count: 1 },
    { name: "Python", count: 1 },
    { name: "Rust", count: 1 },
    { name: "SQL", count: 1 },
    { name: "Go", count: 1 },
    { name: "Docker", count: 1 },
];

export function SnippetFilterGrid({ onOpenCommand }: { onOpenCommand?: () => void }) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"forks" | "views" | "recent">("recent");

    const filteredSnippets = useMemo(() => {
        return SAMPLE_SNIPPETS.filter((snippet) => {
            const matchesLang =
                selectedLanguage === "All" || snippet.language === selectedLanguage;

            const matchesTag =
                !selectedTag || snippet.tags.includes(selectedTag);

            const matchesQuery =
                !searchQuery ||
                snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.tags.some((t) =>
                    t.toLowerCase().includes(searchQuery.toLowerCase())
                ) ||
                snippet.language.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesLang && matchesTag && matchesQuery;
        }).sort((a, b) => {
            if (sortBy === "forks") return b.forkCount - a.forkCount;
            if (sortBy === "views") return b.viewCount - a.viewCount;
            return 0;
        });
    }, [selectedLanguage, searchQuery, selectedTag, sortBy]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Example Snippets</span>
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        See What You Can Build
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-lg">
                        Curated seed snippets showcasing multi-language support, tagging, and code previews.
                    </p>
                </div>

                {/* Quick Search & Command trigger */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-72">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Filter snippets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-12 text-xs text-neutral-900 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                        />
                        <button
                            onClick={onOpenCommand}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                            ⌘K
                        </button>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-700 shadow-sm outline-none transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                        <option value="forks">Most Forked</option>
                        <option value="views">Most Viewed</option>
                        <option value="recent">Recently Added</option>
                    </select>
                </div>
            </div>

            {/* Language Filter Matrix Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                {LANGUAGES.map((lang) => {
                    const isActive = selectedLanguage === lang.name;
                    return (
                        <button
                            key={lang.name}
                            onClick={() => {
                                setSelectedLanguage(lang.name);
                                setSelectedTag(null);
                            }}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shrink-0 ${
                                isActive
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800"
                            }`}
                        >
                            <span>{lang.name}</span>
                            <span
                                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                }`}
                            >
                                {lang.count}
                            </span>
                        </button>
                    );
                })}

                {selectedTag && (
                    <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300">
                        <span>Tag: {selectedTag}</span>
                        <button
                            onClick={() => setSelectedTag(null)}
                            className="ml-1 text-xs font-bold hover:opacity-75"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Snippet Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredSnippets.map((snippet) => (
                        <SnippetCard
                            key={snippet.id}
                            snippet={snippet}
                            onTagClick={(tag) => setSelectedTag(tag)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filteredSnippets.length === 0 && (
                <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-12 text-center">
                    <Code2 className="mx-auto h-8 w-8 text-neutral-400" />
                    <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        No snippets found
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                        Try resetting your search query or language filter.
                    </p>
                    <button
                        onClick={() => {
                            setSelectedLanguage("All");
                            setSearchQuery("");
                            setSelectedTag(null);
                        }}
                        className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}
