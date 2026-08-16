"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useScroll, useMotionValueEvent } from "framer-motion";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useAuthStore } from "@/lib/auth-store";

export default function CodeVaultNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 50);
    });

    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const { theme, setTheme } = useTheme();

    const isAuthenticated = token !== null;

    // Login/signup only return id + email.
    // displayName becomes available after fetching the profile.
    const displayName = user?.displayName ?? user?.email;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Library",
            link: "/snippets",
        },
        {
            name: "Dashboard",
            link: "/dashboard",
        },
    ];

    return (
        <Navbar>
            {/* Desktop Navigation */}
            <NavBody>
                <NavbarLogo />

                <NavItems items={navItems} />

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>
                    )}

                    {isAuthenticated && user ? (
                        <>
                            {/* User: Full at max size, avatar-only on scroll */}
                            <NavbarButton
                                variant="secondary"
                                onClick={() => router.push(`/profile/${user.id}`)}
                                className={isScrolled ? "p-1 rounded-full border border-neutral-200/80 dark:border-neutral-700/80" : "flex items-center"}
                                title={displayName}
                            >
                                <span className={isScrolled ? "flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated text-xs font-semibold text-text-primary border border-neutral-700/50" : "mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated text-xs font-semibold text-text-primary border border-neutral-700/50"}>
                                    {(displayName ?? "?").charAt(0).toUpperCase()}
                                </span>

                                {!isScrolled && (
                                    <span className="max-w-[140px] truncate text-text-primary">
                                        {displayName}
                                    </span>
                                )}
                            </NavbarButton>

                            {/* New */}
                            <NavbarButton
                                variant="primary"
                                onClick={() => router.push("/snippets/new")}
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                New
                            </NavbarButton>

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                aria-label="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <NavbarButton
                                variant="secondary"
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </NavbarButton>

                            <NavbarButton
                                variant="primary"
                                onClick={() => router.push("/register")}
                            >
                                Register
                            </NavbarButton>
                        </>
                    )}
                </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    <NavbarLogo />

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </button>
                        )}

                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() =>
                                setIsMobileMenuOpen((previous) => !previous)
                            }
                        />
                    </div>
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    {navItems.map((item, index) => (
                        <Link
                            key={`mobile-link-${index}`}
                            href={item.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-text-secondary hover:text-cobalt hover:bg-bg-elevated transition-colors"
                        >
                            <span>{item.name}</span>
                        </Link>
                    ))}

                    {isAuthenticated && user ? (
                        <div className="flex w-full flex-col gap-4">
                            <NavbarButton
                                variant="primary"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push("/snippets/new");
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Snippet
                            </NavbarButton>

                            <NavbarButton
                                variant="secondary"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push(`/profile/${user.id}`);
                                }}
                            >
                                Profile
                            </NavbarButton>

                            <NavbarButton
                                variant="secondary"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </NavbarButton>
                        </div>
                    ) : (
                        <div className="flex w-full flex-col gap-4">
                            <NavbarButton
                                variant="secondary"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push("/login");
                                }}
                            >
                                Login
                            </NavbarButton>

                            <NavbarButton
                                variant="primary"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push("/register");
                                }}
                            >
                                Register
                            </NavbarButton>
                        </div>
                    )}
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}

export { CodeVaultNavbar as Navbar };