import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { User } from "#auth/domain/entities";

interface AuthState {
  clearSession: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: null | User) => void;
  user: null | User;
}

const cookieStorage = {
  getItem: (name: string): null | string => {
    if (typeof document === "undefined") return null;
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
    return value ? decodeURIComponent(value) : null;
  },
  removeItem: (name: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      clearSession: () => set({ isAuthenticated: false, user: null }),
      isAuthenticated: false,
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ isAuthenticated: !!user, user }),
      user: null,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
