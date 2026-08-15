import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
};

type AuthStore = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                }),

            clearAuth: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "codevault-auth",
        }
    )
);