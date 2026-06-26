import { beforeEach, describe, expect, it } from "vitest";

import { User } from "#auth/domain/entities";
import { Email } from "#auth/domain/value-objects";

import { useAuthStore } from "./auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });
  });

  describe("Given initial state", () => {
    describe("When store is created", () => {
      it("Then should have default values", () => {
        const state = useAuthStore.getState();

        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(true);
        expect(state.user).toBeNull();
      });
    });
  });

  describe("Given a user object", () => {
    describe("When setUser is called with user", () => {
      it("Then should set user and mark as authenticated", () => {
        const mockUser = User.create({
          email: Email.create("test@example.com"),
          id: "user-123",
          name: "Test User",
        });

        useAuthStore.getState().setUser(mockUser);
        const state = useAuthStore.getState();

        expect(state.user).toBe(mockUser);
        expect(state.isAuthenticated).toBe(true);
      });
    });

    describe("When setUser is called with null", () => {
      it("Then should clear user and mark as not authenticated", () => {
        useAuthStore.getState().setUser(null);
        const state = useAuthStore.getState();

        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });

  describe("Given loading state", () => {
    describe("When setLoading is called with true", () => {
      it("Then should set isLoading to true", () => {
        useAuthStore.getState().setLoading(true);
        const state = useAuthStore.getState();

        expect(state.isLoading).toBe(true);
      });
    });

    describe("When setLoading is called with false", () => {
      it("Then should set isLoading to false", () => {
        useAuthStore.getState().setLoading(false);
        const state = useAuthStore.getState();

        expect(state.isLoading).toBe(false);
      });
    });
  });

  describe("Given an authenticated user", () => {
    beforeEach(() => {
      const mockUser = User.create({
        email: Email.create("test@example.com"),
        id: "user-123",
        name: "Test User",
      });
      useAuthStore.getState().setUser(mockUser);
    });

    describe("When clearSession is called", () => {
      it("Then should clear user and mark as not authenticated", () => {
        useAuthStore.getState().clearSession();
        const state = useAuthStore.getState();

        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });
});
