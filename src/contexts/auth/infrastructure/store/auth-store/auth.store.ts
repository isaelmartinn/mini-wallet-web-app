import { create } from "zustand";

import { User } from "#auth/domain/entities";

interface AuthState {
  clearSession: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: null | User) => void;
  user: null | User;
}

export const useAuthStore = create<AuthState>()((set) => ({
  clearSession: () => set({ isAuthenticated: false, user: null }),
  isAuthenticated: false,
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ isAuthenticated: !!user, user }),
  user: null,
}));
