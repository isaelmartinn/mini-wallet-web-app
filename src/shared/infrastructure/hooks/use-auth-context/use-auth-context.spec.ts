import { describe, expect, it, vi } from "vitest";

import { AuthStore } from "#shared/domain/interfaces";

import { useAuthContext } from "./use-auth-context";

describe("useAuthContext", () => {
  describe("Given an auth store", () => {
    describe("When calling useAuthContext", () => {
      it("Then should return user, isAuthenticated and isLoading", () => {
        const mockUser = { id: "123", name: "Test User" };
        const mockAuthStore = vi.fn((selector) => {
          const state = {
            isAuthenticated: true,
            isLoading: false,
            user: mockUser,
          };
          return selector(state);
        }) as unknown as AuthStore<typeof mockUser>;

        const result = useAuthContext(mockAuthStore);

        expect(result).toEqual({
          isAuthenticated: true,
          isLoading: false,
          user: mockUser,
        });
        expect(mockAuthStore).toHaveBeenCalledTimes(3);
      });

      it("Then should return null user when not authenticated", () => {
        const mockAuthStore = vi.fn((selector) => {
          const state = {
            isAuthenticated: false,
            isLoading: false,
            user: null,
          };
          return selector(state);
        }) as unknown as AuthStore<null>;

        const result = useAuthContext(mockAuthStore);

        expect(result).toEqual({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      });

      it("Then should return isLoading true when loading", () => {
        const mockAuthStore = vi.fn((selector) => {
          const state = {
            isAuthenticated: false,
            isLoading: true,
            user: null,
          };
          return selector(state);
        }) as unknown as AuthStore<null>;

        const result = useAuthContext(mockAuthStore);

        expect(result).toEqual({
          isAuthenticated: false,
          isLoading: true,
          user: null,
        });
      });
    });
  });
});
