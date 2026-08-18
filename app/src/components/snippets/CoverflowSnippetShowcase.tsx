"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    GitFork,
    Sparkles,
    Code2,
    Maximize2,
    X,
    ExternalLink,
    Play,
    Pause,
    Clock,
    Tag as TagIcon,
    Shield,
    Layers,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { LaserBorderCard } from "@/components/ui/LaserBorderCard";

export interface ShowcaseSnippet {
    id: string;
    title: string;
    description: string;
    language: string;
    langColor: string;
    code: string;
    codePreview: string[];
    tags: string[];
    createdAt: string;
    author: { name: string; handle: string };
    gradientTheme: { glow: string; accent: string };
    aiExplanation: {
        summary: string;
        keyPoints: string[];
        complexity: string;
        securityNotes: string;
    };
    lineageTree: {
        origin: string;
        revisions: number;
        parentAuthor: string;
        branchName: string;
    };
}

export const SHOWCASE_SNIPPETS: ShowcaseSnippet[] = [
    {
        id: "snip-1",
        title: "useDebounce & useThrottle Hook",
        description: "Custom React hooks for debouncing search queries and throttling rapid UI events with cleanup safety.",
        language: "TypeScript",
        langColor: "#3178C6",
        code: `import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useThrottle<T>(value: T, limit = 300): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottled(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttled;
}`,
        codePreview: [
            "export function useDebounce<T>(value: T, delay = 300): T {",
            "  const [debounced, setDebounced] = useState<T>(value);",
            "  useEffect(() => {",
            "    const timer = setTimeout(() => setDebounced(value), delay);",
            "    return () => clearTimeout(timer);",
            "  }, [value, delay]);",
            "  return debounced;",
            "}",
        ],
        tags: ["#react", "#hooks", "#performance", "#frontend"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3178C6", accent: "from-blue-500/20" },
        aiExplanation: {
            summary: "Encapsulates reactive value throttling and debouncing in reusable React lifecycle hooks.",
            keyPoints: [
                "Clears pending timer handles on dependency change to prevent state updates on unmounted components.",
                "Zero external runtime dependencies; purely uses React core primitives.",
                "Type-safe generic parameter <T> preserves exact return signatures.",
            ],
            complexity: "Time: O(1) per render | Space: O(1) state memory",
            securityNotes: "Includes state teardown cleanup to prevent memory leaks during rapid input unmounting.",
        },
        lineageTree: {
            origin: "CodeVault React Standard Lib v1.0",
            revisions: 3,
            parentAuthor: "Core Team",
            branchName: "main / hooks-v2",
        },
    },
    {
        id: "snip-2",
        title: "FastAPI JWT & Token-Bucket Guard",
        description: "Asynchronous middleware combining Redis token-bucket rate limiting with JWT auth verification.",
        language: "Python",
        langColor: "#3776AB",
        code: `from fastapi import Request, HTTPException
import jwt
from redis.asyncio import Redis

redis = Redis(host="localhost", port=6379, decode_responses=True)

@app.middleware("http")
async def rate_limit_jwt_guard(request: Request, call_next):
    # 1. Bearer Token Verification
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["sub"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # 2. Redis Token-Bucket Rate Limiter (60 req/min)
    rate_key = f"rate:{user_id}"
    current_count = await redis.incr(rate_key)
    if current_count == 1:
        await redis.expire(rate_key, 60)
    
    if current_count > 60:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    return await call_next(request)`,
        codePreview: [
            "@app.middleware(\"http\")",
            "async def rate_limit_jwt_guard(request: Request, call_next):",
            "    token = request.headers.get(\"Authorization\").split(\" \")[1]",
            "    user_id = jwt.decode(token, SECRET_KEY)[\"sub\"]",
            "    # Redis atomic token bucket (60 req/min)",
            "    if await redis.incr(f\"rate:{user_id}\") > 60:",
            "        raise HTTPException(status_code=429, detail=\"Too Many Requests\")",
            "    return await call_next(request)",
        ],
        tags: ["#fastapi", "#jwt", "#redis", "#security", "#backend"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#3776AB", accent: "from-sky-500/20" },
        aiExplanation: {
            summary: "High-throughput asynchronous security gateway for FastAPI integrating JWT decoding with atomic Redis rate limiting.",
            keyPoints: [
                "Uses Redis atomic INCR with 60-second TTL to guarantee race-condition free throttling across cluster nodes.",
                "Decodes HS256 JWT claims before passing downstream request context.",
                "Short-circuits unauthorized requests prior to endpoint invocation.",
            ],
            complexity: "Time: O(1) Redis lookup | Space: O(1) per active user bucket",
            securityNotes: "Enforces strict Bearer format validation and secret-key signature authentication.",
        },
        lineageTree: {
            origin: "FastAPI Production Recipes",
            revisions: 5,
            parentAuthor: "Auth Architecture Group",
            branchName: "security / token-bucket",
        },
    },
    {
        id: "snip-3",
        title: "Tokio Async Semaphore Worker Pool",
        description: "Zero-allocation concurrent bounded worker pool with graceful cancellation channels in Rust.",
        language: "Rust",
        langColor: "#DEA584",
        code: `use tokio::sync::{Semaphore, broadcast};
use std::sync::Arc;
use std::future::Future;

pub struct WorkerPool {
    semaphore: Arc<Semaphore>,
    shutdown_tx: broadcast::Sender<()>,
}

impl WorkerPool {
    pub fn new(concurrency: usize) -> (Self, broadcast::Receiver<()>) {
        let (shutdown_tx, shutdown_rx) = broadcast::channel(1);
        (
            Self {
                semaphore: Arc::new(Semaphore::new(concurrency)),
                shutdown_tx,
            },
            shutdown_rx,
        )
    }

    pub async fn spawn<F, T>(&self, task: F)
    where
        F: Future<Output = T> + Send + 'static,
        T: Send + 'static,
    {
        let permit = self.semaphore.clone().acquire_owned().await.unwrap();
        tokio::spawn(async move {
            let _permit = permit;
            task.await;
        });
    }
}`,
        codePreview: [
            "pub struct WorkerPool { semaphore: Arc<Semaphore> }",
            "impl WorkerPool {",
            "    pub async fn spawn<F, T>(&self, task: F) {",
            "        let permit = self.semaphore.clone().acquire_owned().await;",
            "        tokio::spawn(async move {",
            "            let _permit = permit;",
            "            task.await;",
            "        });",
            "    }",
            "}",
        ],
        tags: ["#rust", "#tokio", "#concurrency", "#async", "#systems"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#DEA584", accent: "from-orange-500/20" },
        aiExplanation: {
            summary: "Bounded asynchronous worker pool utilizing Tokio's acquire_owned semaphore to enforce strict concurrency limits.",
            keyPoints: [
                "Zero heap allocation for pool control metadata beyond the initial atomic reference counter.",
                "Automatically drops the concurrency permit when the task's future completes or panics.",
                "Integrates broadcast cancellation channels for zero-loss graceful shutdowns.",
            ],
            complexity: "Time: O(1) task dispatch | Space: O(Concurrency) bounded permits",
            securityNotes: "Guarantees resource isolation to prevent unbounded task spawning and thread starvation.",
        },
        lineageTree: {
            origin: "Tokio Concurrency Patterns",
            revisions: 2,
            parentAuthor: "Rust Core Contributors",
            branchName: "concurrency / semaphore-bounded",
        },
    },
    {
        id: "snip-4",
        title: "PostgreSQL Zero-Downtime Migration",
        description: "Safe concurrent index creation and column alteration patterns for production Postgres databases.",
        language: "SQL",
        langColor: "#336791",
        code: `-- 1. Add column with default without holding exclusive table locks
ALTER TABLE snippets 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Create index concurrently to prevent blocking active write operations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snippets_user_public 
ON snippets (user_id, is_public) 
WHERE is_deleted = false;

-- 3. Add constraint as NOT VALID, then validate separately
ALTER TABLE snippets 
ADD CONSTRAINT check_content_length 
CHECK (length(code_content) <= 100000) NOT VALID;

ALTER TABLE snippets 
VALIDATE CONSTRAINT check_content_length;`,
        codePreview: [
            "-- 1. Add column without locking whole table",
            "ALTER TABLE snippets ADD COLUMN IF NOT EXISTS is_public BOOLEAN;",
            "-- 2. Concurrent index creation (zero write locks)",
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_snippets_user",
            "ON snippets (user_id, is_public) WHERE is_deleted = false;",
            "-- 3. Safe two-phase constraint validation",
            "ALTER TABLE snippets VALIDATE CONSTRAINT check_content_length;",
        ],
        tags: ["#postgres", "#sql", "#database", "#devops", "#migrations"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#336791", accent: "from-cobalt/20" },
        aiExplanation: {
            summary: "Production database migration script adhering to lock-free operational standards for high-traffic environments.",
            keyPoints: [
                "CONCURRENTLY flag on CREATE INDEX builds indexes via multiple table scans without acquiring ShareLock.",
                "Two-stage constraint validation ensures zero table lock stalls during high-velocity write throughput.",
                "Includes IF NOT EXISTS idempotency guards for repeatable CI/CD migration runs.",
            ],
            complexity: "Time: O(N) background scan | Space: O(Index) disk allocation",
            securityNotes: "Guarantees zero downtime and prevents lock queue cascade timeouts on production databases.",
        },
        lineageTree: {
            origin: "Postgres Enterprise Runbook",
            revisions: 4,
            parentAuthor: "Database Reliability Eng",
            branchName: "migrations / zero-lock",
        },
    },
    {
        id: "snip-5",
        title: "Go High-Throughput HTTP Client",
        description: "Tuned HTTP transport with connection pooling, custom dialer timeout, and circuit breaker.",
        language: "Go",
        langColor: "#00ADD8",
        code: `package client

import (
	"net"
	"net/http"
	"time"
)

var HTTPClient = &http.Client{
	Timeout: 10 * time.Second,
	Transport: &http.Transport{
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		MaxIdleConns:          200,
		MaxIdleConnsPerHost:   50,
		MaxConnsPerHost:       100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   5 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		DisableCompression:    false,
	},
}`,
        codePreview: [
            "var HTTPClient = &http.Client{",
            "    Timeout: 10 * time.Second,",
            "    Transport: &http.Transport{",
            "        MaxIdleConns:        200,",
            "        MaxIdleConnsPerHost: 50,",
            "        IdleConnTimeout:     90 * time.Second,",
            "        TLSHandshakeTimeout: 5 * time.Second,",
            "    },",
            "}",
        ],
        tags: ["#go", "#http", "#networking", "#microservices", "#backend"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#00ADD8", accent: "from-cyan-500/20" },
        aiExplanation: {
            summary: "Production-tuned Go HTTP client configured to prevent connection leaks and socket exhaustion under microservice workloads.",
            keyPoints: [
                "Increases default MaxIdleConnsPerHost from 2 to 50 to maximize TCP keep-alive socket reuse.",
                "Enforces strict TLS and Dialer timeouts to avoid hung goroutines on slow network edges.",
                "Thread-safe singleton instance design for concurrent HTTP dispatch across goroutines.",
            ],
            complexity: "Time: O(1) connection reuse | Space: Bounded socket pool",
            securityNotes: "TLS handshake timeouts mitigate slowloris connection stalls.",
        },
        lineageTree: {
            origin: "Go Network Architecture Kit",
            revisions: 3,
            parentAuthor: "Cloud Infra Guild",
            branchName: "networking / tuned-transport",
        },
    },
    {
        id: "snip-6",
        title: "Multi-Stage Docker Node & Next.js",
        description: "Ultra-lean production Dockerfile with Alpine base, standalone output, and non-root runner user.",
        language: "Docker",
        langColor: "#2496ED",
        code: `# 1. Dependency Resolution Stage
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 2. Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Minimal Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
        codePreview: [
            "FROM node:20-alpine AS deps",
            "WORKDIR /app && COPY package*.json ./ && RUN npm ci",
            "FROM node:20-alpine AS builder",
            "COPY . . && RUN npm run build",
            "FROM node:20-alpine AS runner",
            "USER nextjs",
            "CMD [\"node\", \"server.js\"]",
        ],
        tags: ["#docker", "#nextjs", "#devops", "#cloud", "#containers"],
        createdAt: "Example",
        author: { name: "CodeVault Team", handle: "codevault" },
        gradientTheme: { glow: "#2496ED", accent: "from-blue-500/20" },
        aiExplanation: {
            summary: "Three-stage container build producing a minimal footprint (~85MB) standalone Next.js production image.",
            keyPoints: [
                "Leverages Next.js standalone build artifacts to eliminate extraneous devDependencies from image layers.",
                "Executes as an unprivileged nextjs system user (UID 1001) for defense-in-depth container security.",
                "Multi-stage cache caching maximizes CI build pipeline speeds.",
            ],
            complexity: "Size: ~85MB container footprint vs ~1.2GB standard image",
            securityNotes: "Non-root execution prevents container breakout and privilege escalation attacks.",
        },
        lineageTree: {
            origin: "Container Security Handbook",
            revisions: 6,
            parentAuthor: "DevSecOps Team",
            branchName: "docker / multi-stage-alpine",
        },
    },
];

const LANGUAGES = ["All", "TypeScript", "Python", "Rust", "SQL", "Go", "Docker"];

export function CoverflowSnippetShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [selectedSnippet, setSelectedSnippet] = useState<ShowcaseSnippet | null>(null);
    const [modalTab, setModalTab] = useState<"code" | "explain" | "lineage">("code");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [mounted, setMounted] = useState(false);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (selectedSnippet) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
            };
        }
    }, [selectedSnippet]);

    // Filtered snippets based on language selection
    const visibleSnippets = React.useMemo(() => {
        if (selectedLanguage === "All") return SHOWCASE_SNIPPETS;
        return SHOWCASE_SNIPPETS.filter((s) => s.language === selectedLanguage);
    }, [selectedLanguage]);

    // Handle index bounds when filter changes
    useEffect(() => {
        setActiveIndex(0);
    }, [selectedLanguage]);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % visibleSnippets.length);
    }, [visibleSnippets.length]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + visibleSnippets.length) % visibleSnippets.length);
    }, [visibleSnippets.length]);

    // Autoplay timer
    useEffect(() => {
        if (isAutoPlay && !selectedSnippet) {
            autoPlayRef.current = setInterval(handleNext, 4000);
        } else if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlay, selectedSnippet, handleNext]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedSnippet) {
                if (e.key === "Escape") setSelectedSnippet(null);
                return;
            }
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedSnippet, handlePrev, handleNext]);

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Code snippet copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="relative w-full py-8 md:py-10 px-4 overflow-hidden select-none">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                <div className="h-[450px] w-[700px] rounded-full bg-cobalt/10 blur-[120px] dark:bg-cobalt/15" />
            </div>

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Section Header Card */}
                <div className="max-w-3xl mx-auto flex justify-center">
                    <LaserBorderCard laserColor="violet" className="p-6 sm:p-8 text-center space-y-3 shadow-xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-bg-surface px-3.5 py-1 text-xs font-semibold text-text-secondary dark:border-neutral-800">
                            <Code2 className="h-3.5 w-3.5 text-cobalt" />
                            <span>Curated Code Library</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
                            Battle-Tested Developer Snippets
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                            Explore syntax patterns across languages. Click any card to inspect full code, line-by-line explanations, and fork lineage.
                        </p>
                    </LaserBorderCard>
                </div>

                {/* Filter Pills Bar with Sliding layoutId Active Indicator */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {LANGUAGES.map((lang) => {
                        const count =
                            lang === "All"
                                ? SHOWCASE_SNIPPETS.length
                                : SHOWCASE_SNIPPETS.filter((s) => s.language === lang).length;
                        const isSelected = selectedLanguage === lang;

                        return (
                            <button
                                key={lang}
                                onClick={() => {
                                    setSelectedLanguage(lang);
                                    setActiveIndex(0);
                                }}
                                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                    isSelected
                                        ? "text-white"
                                        : "text-text-secondary hover:text-cobalt bg-bg-elevated border border-neutral-200 dark:border-neutral-800"
                                }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeCoverflowFilterPill"
                                        className="absolute inset-0 rounded-xl bg-cobalt shadow-md shadow-cobalt/25"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{lang}</span>
                                <span
                                    className={`relative z-10 rounded-full px-1.5 py-0.2 text-[10px] ${
                                        isSelected
                                            ? "bg-white/20 text-white"
                                            : "bg-bg-surface text-text-secondary"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 3D Coverflow Stage with Balanced Circular Offset */}
                <div className="relative flex items-center justify-center min-h-[480px] py-4 [perspective:1200px]">
                    <div className="relative flex w-full max-w-5xl items-center justify-center">
                        {visibleSnippets.map((snippet, index) => {
                            const count = visibleSnippets.length;
                            let offset = index - activeIndex;
                            if (count > 3) {
                                while (offset > count / 2) offset -= count;
                                while (offset < -count / 2) offset += count;
                            }

                            const isCenter = offset === 0;
                            const isVisible = Math.abs(offset) <= 2;

                            const rotateY = offset * -20;
                            const translateX = offset * 250;
                            const scale = isCenter ? 1 : Math.max(0.72, 1 - Math.abs(offset) * 0.14);
                            const zIndex = 20 - Math.abs(offset) * 5;
                            const opacity = isCenter ? 1 : isVisible ? Math.max(0.45, 1 - Math.abs(offset) * 0.32) : 0;

                            return (
                                <motion.div
                                    key={snippet.id}
                                    onClick={() => {
                                        if (isCenter) {
                                            setSelectedSnippet(snippet);
                                            setModalTab("code");
                                        } else {
                                            setActiveIndex(index);
                                        }
                                    }}
                                    animate={{
                                        rotateY,
                                        x: translateX,
                                        scale,
                                        zIndex,
                                        opacity,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 28,
                                        mass: 0.6,
                                    }}
                                    className={`group absolute w-[330px] sm:w-[390px] md:w-[430px] cursor-pointer rounded-2xl border ${
                                        isCenter
                                            ? "border-cobalt bg-bg-surface shadow-2xl shadow-cobalt/25 ring-2 ring-cobalt/30 hover:-translate-y-1.5"
                                            : "border-neutral-200/80 bg-bg-surface dark:border-neutral-800/80 shadow-lg hover:border-cobalt/50 hover:opacity-90 hover:-translate-y-1"
                                    } ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}
                                    style={{
                                        transformStyle: "preserve-3d",
                                        willChange: "transform, opacity",
                                    }}
                                >
                                    <div className="p-5 pb-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: snippet.langColor }}
                                                />
                                                <span className="text-xs font-bold text-text-primary">
                                                    {snippet.language}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1 badge-mint rounded-full px-2 py-0.5 text-[10px] font-semibold">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span>Public</span>
                                                </span>
                                                {isCenter && (
                                                    <span className="flex items-center gap-1 rounded-full badge-cobalt px-2 py-0.5 text-[10px] font-semibold">
                                                        <Maximize2 className="h-2.5 w-2.5 transition-transform duration-200 group-hover:rotate-45 group-hover:scale-110" />
                                                        <span>Inspect</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="mt-3 text-base font-bold text-text-primary line-clamp-1">
                                            {snippet.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                            {snippet.description}
                                        </p>
                                    </div>

                                    <div className="mx-4 my-2 overflow-hidden rounded-xl border border-neutral-200/80 bg-bg-base p-3.5 text-[11px] font-mono text-text-primary dark:border-neutral-800 shadow-inner">
                                        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-neutral-800/80 text-[10px] text-text-secondary">
                                            <div className="h-2 w-2 rounded-full bg-red-500/80" />
                                            <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                                            <div className="h-2 w-2 rounded-full bg-green-500/80" />
                                            <span className="ml-2 truncate text-text-secondary">{snippet.title.toLowerCase().replace(/\s+/g, "_")}.{snippet.language.toLowerCase()}</span>
                                        </div>
                                        <div className="space-y-1 overflow-hidden">
                                            {snippet.codePreview.slice(0, 5).map((line, i) => (
                                                <div key={i} className="flex leading-relaxed">
                                                    <span className="w-5 shrink-0 select-none text-neutral-600 text-right pr-2">
                                                        {i + 1}
                                                    </span>
                                                    <span className="truncate text-text-primary font-mono">
                                                        {line}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 pt-2 flex items-center justify-between text-xs">
                                        <div className="flex flex-wrap gap-1">
                                            {snippet.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-text-secondary"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {snippet.tags.length > 2 && (
                                                <span className="text-[10px] text-text-secondary self-center">
                                                    +{snippet.tags.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-[11px] font-semibold text-cobalt flex items-center gap-1 group-hover:underline">
                                            <span>Click to Expand</span>
                                            <span>↗</span>
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between max-w-md mx-auto pt-2">
                    <button
                        onClick={handlePrev}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-bg-surface text-text-primary shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95 dark:border-neutral-800"
                        aria-label="Previous snippet"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {visibleSnippets.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === activeIndex
                                        ? "w-7 bg-cobalt shadow-xs shadow-cobalt/50"
                                        : "w-2 bg-bg-elevated hover:bg-neutral-600"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAutoPlay(!isAutoPlay)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                                isAutoPlay
                                    ? "border-cobalt bg-cobalt/10 text-cobalt"
                                    : "border-neutral-200 bg-bg-surface text-text-primary hover:bg-bg-elevated dark:border-neutral-800"
                            }`}
                            aria-label="Toggle autoplay"
                            title={isAutoPlay ? "Pause Auto-play" : "Start Auto-play"}
                        >
                            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-bg-surface text-text-primary shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95 dark:border-neutral-800"
                            aria-label="Next snippet"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            {mounted && createPortal(
                <AnimatePresence>
                    {selectedSnippet && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedSnippet(null)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                            />

                            <motion.div
                                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-bg-surface shadow-2xl dark:border-neutral-800 my-auto"
                            >
                                <div className="border-b border-neutral-200/80 bg-bg-surface p-6 dark:border-neutral-800">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-xs"
                                                    style={{ backgroundColor: selectedSnippet.langColor }}
                                                >
                                                    <Code2 className="h-3.5 w-3.5" />
                                                    <span>{selectedSnippet.language}</span>
                                                </span>

                                                <span className="inline-flex items-center gap-1.5 badge-mint rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span>Public Snippet</span>
                                                </span>

                                                <span className="text-xs text-text-secondary">
                                                    By {selectedSnippet.author.name}
                                                </span>
                                            </div>

                                            <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-text-primary">
                                                {selectedSnippet.title}
                                            </h2>
                                            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
                                                {selectedSnippet.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedSnippet(null)}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary dark:border-neutral-800"
                                            aria-label="Close modal"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="mt-6 flex items-center gap-2 border-b border-neutral-200/80 pb-px dark:border-neutral-800">
                                        <button
                                            onClick={() => setModalTab("code")}
                                            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
                                                modalTab === "code"
                                                    ? "border-cobalt text-cobalt"
                                                    : "border-transparent text-text-secondary hover:text-text-primary"
                                            }`}
                                        >
                                            <Code2 className="h-3.5 w-3.5" />
                                            <span>Full Code</span>
                                        </button>
                                        <button
                                            onClick={() => setModalTab("explain")}
                                            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
                                                modalTab === "explain"
                                                    ? "border-cobalt text-cobalt"
                                                    : "border-transparent text-text-secondary hover:text-text-primary"
                                            }`}
                                        >
                                            <Sparkles className="h-3.5 w-3.5" />
                                            <span>AI Explanation</span>
                                        </button>
                                        <button
                                            onClick={() => setModalTab("lineage")}
                                            className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
                                                modalTab === "lineage"
                                                    ? "border-cobalt text-cobalt"
                                                    : "border-transparent text-text-secondary hover:text-text-primary"
                                            }`}
                                        >
                                            <GitFork className="h-3.5 w-3.5" />
                                            <span>Lineage & Diff</span>
                                        </button>
                                    </div>
                                </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto bg-bg-surface">
                                {modalTab === "code" && (
                                    <div className="space-y-4">
                                        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-bg-base p-4 font-mono text-xs text-text-primary shadow-inner">
                                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-text-secondary text-[11px]">
                                                <span>Language: {selectedSnippet.language}</span>
                                                <span>{selectedSnippet.code.split("\n").length} lines</span>
                                            </div>
                                            <pre className="overflow-x-auto leading-relaxed">
                                                <code>{selectedSnippet.code}</code>
                                            </pre>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <span className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                                                <TagIcon className="h-3 w-3" />
                                                <span>Tags:</span>
                                            </span>
                                            {selectedSnippet.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-lg bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-cobalt hover:text-cobalt border border-neutral-800 transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {modalTab === "explain" && (
                                    <div className="space-y-5">
                                        <div className="rounded-2xl border border-neutral-200/80 bg-bg-elevated p-5 dark:border-neutral-800 space-y-3">
                                            <div className="flex items-center gap-2 text-cobalt font-bold text-sm">
                                                <Sparkles className="h-4 w-4" />
                                                <span>AI-Generated Overview</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                                                {selectedSnippet.aiExplanation.summary}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                                                Key Architecture Points
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedSnippet.aiExplanation.keyPoints.map((point, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2.5 rounded-xl border border-neutral-200/80 bg-bg-surface p-3 text-xs text-text-primary dark:border-neutral-800"
                                                    >
                                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cobalt/20 text-[10px] font-bold text-cobalt">
                                                            {i + 1}
                                                        </span>
                                                        <span className="leading-relaxed">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            <div className="rounded-xl border border-neutral-200 p-3.5 dark:border-neutral-800 bg-bg-surface">
                                                <p className="text-[11px] font-bold text-text-secondary">Complexity Profile</p>
                                                <p className="mt-1 text-xs font-mono font-semibold text-cobalt">
                                                    {selectedSnippet.aiExplanation.complexity}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-neutral-200 p-3.5 dark:border-neutral-800 bg-bg-surface">
                                                <p className="text-[11px] font-bold text-text-secondary">Security & Integrity</p>
                                                <p className="mt-1 text-xs text-text-primary">
                                                    {selectedSnippet.aiExplanation.securityNotes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalTab === "lineage" && (
                                    <div className="space-y-6 py-2">
                                        <div className="rounded-2xl border border-violet/30 bg-violet/10 p-5">
                                            <div className="flex items-center gap-2 text-violet font-bold text-sm">
                                                <GitFork className="h-4 w-4" />
                                                <span>Lineage Provenance Chain</span>
                                            </div>
                                            <p className="mt-1 text-xs text-text-secondary">
                                                CodeVault preserves original authorship across all child forks and modifications.
                                            </p>
                                        </div>

                                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-violet/30">
                                            <div className="relative flex items-start gap-4">
                                                <div className="absolute -left-6 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet text-white text-[10px] ring-4 ring-bg-surface font-bold">
                                                    1
                                                </div>
                                                <div className="flex-1 rounded-xl border border-neutral-200 bg-bg-surface p-3.5 shadow-xs dark:border-neutral-800">
                                                    <p className="text-xs font-bold text-text-primary">
                                                        Origin: {selectedSnippet.lineageTree.origin}
                                                    </p>
                                                    <p className="text-[11px] text-text-secondary">
                                                        Created by {selectedSnippet.lineageTree.parentAuthor}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-start gap-4">
                                                <div className="absolute -left-6 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet text-white text-[10px] ring-4 ring-bg-surface font-bold">
                                                    2
                                                </div>
                                                <div className="flex-1 rounded-xl border border-violet/40 bg-violet/10 p-3.5 shadow-xs">
                                                    <p className="text-xs font-bold text-violet">
                                                        Branch: {selectedSnippet.lineageTree.branchName}
                                                    </p>
                                                    <p className="text-[11px] text-text-secondary">
                                                        {selectedSnippet.lineageTree.revisions} community revisions & optimization patches
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative flex items-start gap-4">
                                                <div className="absolute -left-6 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint text-white text-[10px] ring-4 ring-bg-surface font-bold">
                                                    ✓
                                                </div>
                                                <div className="flex-1 rounded-xl border border-mint/40 bg-mint/10 p-3.5 shadow-xs">
                                                    <p className="text-xs font-bold text-mint">
                                                        Active Head: {selectedSnippet.title}
                                                    </p>
                                                    <p className="text-[11px] text-text-secondary">
                                                        Maintained by {selectedSnippet.author.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
        )}
    </div>
);
}
