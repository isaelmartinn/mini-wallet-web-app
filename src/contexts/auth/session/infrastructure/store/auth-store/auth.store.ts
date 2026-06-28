import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { User } from "#auth/session/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

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
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<{
          isAuthenticated: boolean;
          user: null | {
            email: null | string;
            id: string;
            name: string;
            phone: null | string;
          };
        }>;

        return {
          ...currentState,
          isAuthenticated: persisted.isAuthenticated ?? false,
          user: persisted.user
            ? User.create({
                email: persisted.user.email
                  ? Email.rehydrate(persisted.user.email)
                  : undefined,
                id: persisted.user.id,
                name: persisted.user.name,
                phone: persisted.user.phone
                  ? Phone.rehydrate(persisted.user.phone)
                  : undefined,
              })
            : null,
        };
      },
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
          ? {
              email: state.user.getEmail()?.getValue() ?? null,
              id: state.user.getId(),
              name: state.user.getName(),
              phone: state.user.getPhone()?.getValue() ?? null,
            }
          : null,
      }),
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
