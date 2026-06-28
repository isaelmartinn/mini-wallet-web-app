import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "#auth/domain/entities";
import { StoredUserData } from "#auth/infrastructure/dtos";
import { Email, Phone } from "#shared/domain/value-objects";

interface AuthState {
  clearSession: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: null | User) => void;
  user: null | User;
}

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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          if (state.user) {
            const userData = state.user as unknown as StoredUserData;
            state.user = User.create({
              email: userData.email
                ? Email.rehydrate(userData.email)
                : undefined,
              id: userData.id,
              name: userData.name,
              phone: userData.phone
                ? Phone.rehydrate(userData.phone)
                : undefined,
            });
          }
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
          ? {
              email: state.user.getEmail()?.getValue(),
              id: state.user.getId(),
              name: state.user.getName(),
              phone: state.user.getPhone()?.getValue(),
            }
          : null,
      }),
    }
  )
);
