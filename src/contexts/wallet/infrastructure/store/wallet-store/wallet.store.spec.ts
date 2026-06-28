import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Balance, UserProfile } from "#wallet/domain/entities";
import { BalanceAmount } from "#wallet/domain/value-objects";

import { useWalletStore } from "./wallet.store";

describe("useWalletStore", () => {
  describe("Given initial state", () => {
    describe("When the store is created", () => {
      it("Then should have default values", () => {
        const { result } = renderHook(() => useWalletStore());

        expect(result.current.balance).toBeNull();
        expect(result.current.userProfile).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("Given a balance", () => {
    describe("When setBalance is called", () => {
      it("Then should update the balance", () => {
        const { result } = renderHook(() => useWalletStore());
        const amount = BalanceAmount.create(1000);
        const mockBalance = Balance.create({
          amount,
          currency: "MXN",
          userId: "user-1",
        });

        act(() => {
          result.current.setBalance(mockBalance);
        });

        expect(result.current.balance).toBe(mockBalance);
      });
    });
  });

  describe("Given a user profile", () => {
    describe("When setUserProfile is called", () => {
      it("Then should update the user profile", () => {
        const { result } = renderHook(() => useWalletStore());
        const mockProfile = UserProfile.create({
          fullName: "Test User",
          userId: "user-1",
        });

        act(() => {
          result.current.setUserProfile(mockProfile);
        });

        expect(result.current.userProfile).toBe(mockProfile);
      });
    });
  });

  describe("Given a loading state", () => {
    describe("When setLoading is called with true", () => {
      it("Then should set isLoading to true", () => {
        const { result } = renderHook(() => useWalletStore());

        act(() => {
          result.current.setLoading(true);
        });

        expect(result.current.isLoading).toBe(true);
      });
    });

    describe("When setLoading is called with false", () => {
      it("Then should set isLoading to false", () => {
        const { result } = renderHook(() => useWalletStore());

        act(() => {
          result.current.setLoading(true);
        });

        act(() => {
          result.current.setLoading(false);
        });

        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("Given a wallet with data", () => {
    describe("When clearWallet is called", () => {
      it("Then should reset all wallet data", () => {
        const { result } = renderHook(() => useWalletStore());
        const amount = BalanceAmount.create(1000);
        const mockBalance = Balance.create({
          amount,
          currency: "MXN",
          userId: "user-1",
        });
        const mockProfile = UserProfile.create({
          fullName: "Test User",
          userId: "user-1",
        });

        act(() => {
          result.current.setBalance(mockBalance);
          result.current.setUserProfile(mockProfile);
          result.current.setLoading(true);
        });

        act(() => {
          result.current.clearWallet();
        });

        expect(result.current.balance).toBeNull();
        expect(result.current.userProfile).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
