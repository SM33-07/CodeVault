import { SAMPLE_SNIPPETS } from "@/components/snippets/SnippetFilterGrid";

export interface StoredSnippet {
    id: string;
    title: string;
    description?: string;
    language: string;
    langColor?: string;
    code?: string;
    codeBody?: string;
    codePreview?: string;
    tags?: string[];
    visibility?: "public" | "private";
    isPrivate?: boolean;
    forkCount?: number;
    viewCount?: number;
    forkedFromId?: string | null;
    forkedFromTitle?: string | null;
    isFork?: boolean;
    createdAt?: string;
    updatedAt?: string;
    ownerId?: string;
    author?: {
        name?: string;
        handle?: string;
        avatar?: string;
    };
    gradientTheme?: any;
    snippetTags?: Array<{ id: string; tagId: string; tag: { id: string; name: string } }>;
}

const FORKS_STORAGE_KEY = "codevault_user_forks";
const SNIPPETS_STORAGE_KEY = "codevault_user_snippets";

export function isForkSnippet(s: any): boolean {
    if (!s) return false;
    return Boolean(
        s.forkedFromId ||
        s.forkedFrom ||
        s.isFork ||
        (typeof s.title === "string" && s.title.includes("(Fork)")) ||
        (Array.isArray(s.tags) && s.tags.includes("forked")) ||
        (Array.isArray(s.snippetTags) && s.snippetTags.some((st: any) => st?.tag?.name === "forked"))
    );
}

export function getStoredForks(userId?: string): StoredSnippet[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(FORKS_STORAGE_KEY);
        if (!raw) return [];
        const parsed: StoredSnippet[] = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        if (userId) {
            return parsed.filter((f) => !f.ownerId || f.ownerId === userId || f.ownerId === "me");
        }
        return parsed;
    } catch {
        return [];
    }
}

export function saveStoredFork(fork: StoredSnippet): void {
    if (typeof window === "undefined") return;
    try {
        const current = getStoredForks();
        const existingIndex = current.findIndex((f) => f.id === fork.id);
        const normalizedFork: StoredSnippet = {
            ...fork,
            isFork: true,
            forkedFromId: fork.forkedFromId || (fork as any).forkedFrom?.id || null,
            tags: Array.isArray(fork.tags)
                ? (fork.tags.includes("forked") ? fork.tags : [...fork.tags, "forked"])
                : ["forked"],
        };

        let updated: StoredSnippet[];
        if (existingIndex >= 0) {
            updated = [...current];
            updated[existingIndex] = { ...updated[existingIndex], ...normalizedFork };
        } else {
            updated = [normalizedFork, ...current];
        }

        localStorage.setItem(FORKS_STORAGE_KEY, JSON.stringify(updated));

        // Also save to all snippets storage
        saveStoredSnippet(normalizedFork);

        window.dispatchEvent(new CustomEvent("codevault-vault-updated", { detail: { fork: normalizedFork } }));
    } catch (err) {
        console.warn("Failed to persist fork to localStorage:", err);
    }
}

export function getStoredSnippets(userId?: string): StoredSnippet[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(SNIPPETS_STORAGE_KEY);
        if (!raw) return [];
        const parsed: StoredSnippet[] = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        if (userId) {
            return parsed.filter((s) => !s.ownerId || s.ownerId === userId || s.ownerId === "me");
        }
        return parsed;
    } catch {
        return [];
    }
}

export function saveStoredSnippet(snippet: StoredSnippet): void {
    if (typeof window === "undefined") return;
    try {
        const current = getStoredSnippets();
        const existingIndex = current.findIndex((s) => s.id === snippet.id);
        let updated: StoredSnippet[];
        if (existingIndex >= 0) {
            updated = [...current];
            updated[existingIndex] = { ...updated[existingIndex], ...snippet };
        } else {
            updated = [snippet, ...current];
        }
        localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
        console.warn("Failed to persist snippet to localStorage:", err);
    }
}

export function findSnippetByIdLocal(id: string): StoredSnippet | null {
    if (typeof window === "undefined") {
        return (SAMPLE_SNIPPETS.find((s) => s.id === id) as any) || null;
    }
    const localForks = getStoredForks();
    const foundFork = localForks.find((f) => f.id === id);
    if (foundFork) return foundFork;

    const localSnippets = getStoredSnippets();
    const foundSnippet = localSnippets.find((s) => s.id === id);
    if (foundSnippet) return foundSnippet;

    const sample = SAMPLE_SNIPPETS.find((s) => s.id === id);
    return (sample as any) || null;
}
