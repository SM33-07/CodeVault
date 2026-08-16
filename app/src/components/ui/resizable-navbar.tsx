"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu as IconMenu2, X as IconX } from "lucide-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        if (latest > 50) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            className={cn("sticky inset-x-0 top-0 z-50 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "45%" : "100%",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: visible ? "760px" : "auto",
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-3 lg:flex",
                visible && "bg-bg-surface/85 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 shadow-xl shadow-black/10",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-text-secondary transition duration-200 lg:flex lg:space-x-2 pointer-events-none",
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    key={`link-${idx}`}
                    href={item.link}
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className="pointer-events-auto relative px-4 py-2 text-text-secondary transition-colors hover:text-cobalt dark:hover:text-cobalt group"
                >
                    {hovered === idx && (
                        <motion.div
                            layoutId="hovered"
                            className="absolute inset-0 h-full w-full rounded-full bg-bg-elevated"
                        />
                    )}
                    <span className="relative z-20 nav-link-underline">{item.name}</span>
                </Link>
            ))}
        </motion.div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.1)"
                    : "none",
                width: visible ? "90%" : "100%",
                paddingRight: visible ? "12px" : "16px",
                paddingLeft: visible ? "12px" : "16px",
                borderRadius: visible ? "2rem" : "0rem",
                y: visible ? 20 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden",
                visible && "bg-bg-surface/85 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                        "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl bg-bg-surface px-4 py-8 shadow-2xl border border-neutral-200 dark:border-neutral-800",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <IconX className="text-text-primary cursor-pointer h-5 w-5" onClick={onClick} />
    ) : (
        <IconMenu2 className="text-text-primary cursor-pointer h-5 w-5" onClick={onClick} />
    );
};

export const NavbarLogo = ({
    href = "/",
    children,
    className,
}: {
    href?: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <Link
            href={href}
            className={cn(
                "relative z-20 flex items-center space-x-2 text-sm font-normal text-text-primary group",
                className,
            )}
        >
            {children ?? (
                <>
                    <Image
                        src="/images/logo_codevault_light.png"
                        alt="CodeVault"
                        width={180}
                        height={48}
                        className="h-7 md:h-8 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.35)] dark:hidden"
                        priority
                    />
                    <Image
                        src="/images/logo_codevault_dark.png"
                        alt="CodeVault"
                        width={180}
                        height={48}
                        className="h-7 md:h-8 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.4)] hidden dark:block"
                        priority
                    />
                </>
            )}
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "button",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
)) => {
    const baseStyles =
        "px-4 py-2 rounded-full text-sm font-semibold relative cursor-pointer transition-all duration-200 inline-flex items-center justify-center text-center";

    const variantStyles = {
        primary:
            "sheen-button bg-cobalt text-white hover:bg-cobalt-hover active:bg-cobalt-active shadow-md shadow-cobalt/20 hover:shadow-lg hover:shadow-cobalt/35 hover:-translate-y-0.5 active:scale-95",
        secondary: "bg-transparent text-text-primary hover:bg-bg-elevated hover:text-cobalt nav-link-underline",
        dark: "bg-bg-elevated text-text-primary hover:bg-bg-surface border border-neutral-700/80 shadow-md hover:-translate-y-0.5 active:scale-95",
        gradient:
            "sheen-button bg-gradient-to-r from-cobalt to-violet text-white shadow-md shadow-cobalt/20 hover:opacity-95 hover:shadow-lg hover:shadow-violet/30 hover:-translate-y-0.5 active:scale-95",
    };

    if (href && Tag === "a") {
        return (
            <Link
                href={href}
                className={cn(baseStyles, variantStyles[variant], className)}
                {...(props as any)}
            >
                {children}
            </Link>
        );
    }

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
