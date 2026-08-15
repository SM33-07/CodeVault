"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");

        if (error) {
            toast.error(decodeURIComponent(error));
            router.replace("/login");
            return;
        }

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                setAuth(token, user);
                toast.success(`Welcome, ${user.displayName || user.email}!`);
                router.replace("/dashboard");
            } catch (err) {
                console.error("Failed to parse user data from OAuth callback:", err);
                toast.error("Failed to parse user profile. Please try logging in again.");
                router.replace("/login");
            }
        } else {
            toast.error("Missing authentication token. Please try logging in again.");
            router.replace("/login");
        }
    }, [searchParams, router, setAuth]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Completing authentication...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
