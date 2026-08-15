"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, Code2, Plus } from "lucide-react";
import { SnippetCard, SnippetItem } from "./SnippetCard";

export const SAMPLE_SNIPPETS: SnippetItem[] = [
    {
        id: "snip-1",
        title: "useDebounce & useThrottle Hook",
        description: "Custom React hooks for debouncing search queries and throttling rapid UI events.",
        language: "TypeScript",
        langColor: "#3178C6",
        code: `import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState<T>(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}`,
        codePreview: [
            "export function useDebounce<T>(value: T, delay = 300): T {",
            "  const [debounced, setDebounced] = useState<T>(value);",
            "  useEffect(() => { const timer = setTimeout(...) }, [value]);",
            "  return debounced; }",
        ],
        tags: ["#react", "#hooks", "#performance"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3178C6", accent: "from-blue-500/20" },
    },
    {
        id: "snip-2",
        title: "FastAPI JWT & Rate-Limiter Guard",
        description: "Asynchronous middleware combining Redis token-bucket rate limiting with JWT auth verification.",
        language: "Python",
        langColor: "#3776AB",
        code: `@app.middleware("http")\nasync def rate_limit_jwt_guard(request: Request, call_next):\n    token = request.headers.get("Authorization")\n    user_id = verify_jwt(token)\n    if not await check_rate_limit(user_id):\n        raise HTTPException(status_code=429, detail="Too Many Requests")\n    return await call_next(request)`,
        codePreview: [
            "@app.middleware(\"http\")",
            "async def rate_limit_jwt_guard(request: Request, call_next):",
            "    user_id = verify_jwt(request.headers.get(\"Authorization\"))",
            "    if not await check_rate_limit(user_id): raise 429",
        ],
        tags: ["#fastapi", "#jwt", "#redis", "#security"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3776AB", accent: "from-sky-500/20" },
    },
    {
        id: "snip-3",
        title: "Tokio Async Semaphore Worker Pool",
        description: "Zero-allocation concurrent bounded worker pool with graceful cancellation channels in Rust.",
        language: "Rust",
        langColor: "#DEA584",
        code: `use tokio::sync::Semaphore;\nuse std::sync::Arc;\n\npub struct WorkerPool {\n    sem: Arc<Semaphore>,\n}\n\nimpl WorkerPool {\n    pub async fn spawn<F>(&self, task: F) where F: Future + Send + 'static {\n        let permit = self.sem.clone().acquire_owned().await.unwrap();\n        tokio::spawn(async move { task.await; drop(permit); });\n    }\n}`,
        codePreview: [
            "pub struct WorkerPool { sem: Arc<Semaphore> }",
            "impl WorkerPool {",
            "    pub async fn spawn<F>(&self, task: F) {",
            "        let permit = self.sem.clone().acquire_owned().await;",
        ],
        tags: ["#rust", "#tokio", "#concurrency", "#async"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#DEA584", accent: "from-orange-500/20" },
    },
    {
        id: "snip-4",
        title: "PostgreSQL Zero-Downtime Migration",
        description: "Safe concurrent index creation and column alteration patterns for production Postgres databases.",
        language: "SQL",
        langColor: "#336791",
        code: `-- 1. Add column nullable\nALTER TABLE snippets ADD COLUMN IF NOT EXISTS encrypted_body TEXT;\n-- 2. Create index concurrently\nCREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snippets_user_id \nON snippets (user_id) WHERE is_deleted = false;`,
        codePreview: [
            "-- Safe concurrent index creation",
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snippets_user",
            "ON snippets (user_id) WHERE is_deleted = false;",
            "-- Zero table locks during peak traffic",
        ],
        tags: ["#postgres", "#sql", "#database", "#devops"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#336791", accent: "from-indigo-500/20" },
    },
    {
        id: "snip-5",
        title: "Go High-Throughput HTTP Client",
        description: "Tuned HTTP transport with connection pooling, custom dialer timeout, and circuit breaker.",
        language: "Go",
        langColor: "#00ADD8",
        code: `var HTTPClient = &http.Client{\n    Timeout: 10 * time.Second,\n    Transport: &http.Transport{\n        MaxIdleConns:        100,\n        MaxIdleConnsPerHost: 20,\n        IdleConnTimeout:     90 * time.Second,\n        DisableCompression: false,\n    },\n}`,
        codePreview: [
            "var HTTPClient = &http.Client{",
            "    Timeout: 10 * time.Second,",
            "    Transport: &http.Transport{ MaxIdleConns: 100 },",
            "}",
        ],
        tags: ["#go", "#http", "#networking", "#microservices"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#00ADD8", accent: "from-cyan-500/20" },
    },
    {
        id: "snip-6",
        title: "Multi-Stage Docker Node & Next.js",
        description: "Ultra-lean production Dockerfile with Alpine base, standalone output, and non-root runner user.",
        language: "Docker",
        langColor: "#2496ED",
        code: `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nUSER node\nCMD ["node", "server.js"]`,
        codePreview: [
            "FROM node:20-alpine AS builder",
            "WORKDIR /app && RUN npm ci && RUN npm run build",
            "FROM node:20-alpine AS runner",
            "USER node && CMD [\"node\", \"server.js\"]",
        ],
        tags: ["#docker", "#nextjs", "#devops", "#cloud"],
        stars: 0,
        copies: 0,
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#2496ED", accent: "from-blue-500/20" },
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
    const [sortBy, setSortBy] = useState<"stars" | "copies" | "recent">("stars");

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
            if (sortBy === "stars") return b.stars - a.stars;
            if (sortBy === "copies") return b.copies - a.copies;
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
                        <option value="stars">Most Starred</option>
                        <option value="copies">Most Copied</option>
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
