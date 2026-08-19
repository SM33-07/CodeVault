"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { CyberLoader } from "@/components/ui/CyberLoader";

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
        <CyberLoader
            fullscreen
            size="lg"
            label="Authorizing Vault Session..."
            subtitle="Exchanging cryptographic tokens..."
        />
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <CyberLoader
                    fullscreen
                    size="lg"
                    label="Authorizing Vault Session..."
                    subtitle="Initializing security handshake..."
                />
            }
        >
            <AuthCallbackContent />
        </Suspense>
    );
}
