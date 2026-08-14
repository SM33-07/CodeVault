"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const HIDE_NAV_ROUTES = ["/login", "/register", "/dashboard"];

export function NavbarWrapper() {
    const pathname = usePathname();
    const shouldHideNav = HIDE_NAV_ROUTES.some((route) => pathname.startsWith(route));

    if (shouldHideNav) return null;

    return <Navbar />;
}
