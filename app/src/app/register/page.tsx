"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/lib/auth-store";
import { apiPost } from "@/lib/api";

// Social button component
function SocialButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
        >
            {icon}
            {label}
        </button>
    );
}

// Divider component
function Divider() {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500">
                    or continue with email
                </span>
            </div>
        </div>
    );
}

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
    const getStrength = (pw: string): { level: number; label: string; color: string } => {
        if (pw.length === 0) return { level: 0, label: "", color: "" };
        if (pw.length < 6) return { level: 1, label: "Weak", color: "bg-red-500" };
        if (pw.length < 8)
            return { level: 2, label: "Fair", color: "bg-yellow-500" };

        let score = 0;
        if (/[a-z]/.test(pw)) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;

        if (score >= 3 && pw.length >= 10)
            return { level: 4, label: "Strong", color: "bg-green-500" };
        if (score >= 2)
            return { level: 3, label: "Good", color: "bg-blue-500" };
        return { level: 2, label: "Fair", color: "bg-yellow-500" };
    };

    const strength = getStrength(password);

    if (strength.level === 0) return null;

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((bar) => (
                    <motion.div
                        key={bar}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            bar <= strength.level
                                ? strength.color
                                : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: bar * 0.05 }}
                    />
                ))}
            </div>
            <p
                className={`text-xs font-medium ${
                    strength.level <= 1
                        ? "text-red-500"
                        : strength.level === 2
                          ? "text-yellow-500"
                          : strength.level === 3
                            ? "text-blue-500"
                            : "text-green-500"
                }`}
            >
                {strength.label}
            </p>
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!displayName || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (!agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiPost<{
                token: string;
                user: { id: string; email: string; displayName?: string };
            }>("/api/auth/signup", { displayName, email, password });

            setAuth(response.token, response.user);
            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const staggerDelay = 0.05;

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start organizing your code snippets today"
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkHref="/login"
        >
            {/* Social Login */}
            <div className="flex flex-col gap-3">
                <SocialButton
                    icon={
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    }
                    label="Continue with Google"
                />
                <SocialButton
                    icon={
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    }
                    label="Continue with GitHub"
                />
            </div>

            <Divider />

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display Name */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + staggerDelay * 0 }}
                >
                    <label
                        htmlFor="register-name"
                        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Display Name
                    </label>
                    <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="register-name"
                            type="text"
                            placeholder="Your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            autoComplete="name"
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-900 shadow-sm outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-500"
                        />
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + staggerDelay * 1 }}
                >
                    <label
                        htmlFor="register-email"
                        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-900 shadow-sm outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-500"
                        />
                    </div>
                </motion.div>

                {/* Password */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + staggerDelay * 2 }}
                >
                    <label
                        htmlFor="register-password"
                        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-12 text-sm text-neutral-900 shadow-sm outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <PasswordStrength password={password} />
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + staggerDelay * 3 }}
                >
                    <label
                        htmlFor="register-confirm-password"
                        className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm text-neutral-900 shadow-sm outline-none transition-all duration-200 placeholder:text-neutral-400 focus:ring-2 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 ${
                                confirmPassword && confirmPassword !== password
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                                    : confirmPassword && confirmPassword === password
                                      ? "border-green-400 focus:border-green-500 focus:ring-green-500/20"
                                      : "border-neutral-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-neutral-800 dark:focus:border-indigo-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                        <p className="mt-1 text-xs text-red-500">
                            Passwords do not match
                        </p>
                    )}
                </motion.div>

                {/* Terms */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + staggerDelay * 4 }}
                >
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:border-neutral-700"
                        />
                        <span>
                            I agree to the{" "}
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                Terms of Service
                            </button>{" "}
                            and{" "}
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                Privacy Policy
                            </button>
                        </span>
                    </label>
                </motion.div>

                {/* Submit */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full overflow-hidden rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:focus:ring-offset-neutral-950"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </motion.div>
            </form>
        </AuthLayout>
    );
}
