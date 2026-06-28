import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Balance } from "#wallet/balance/domain/entities";
import { BalanceAmount } from "#wallet/balance/domain/value-objects";
import { useWalletStore } from "#wallet/balance/infrastructure/store";
import { UserProfile } from "#wallet/user-profile/domain/entities";

import { useWalletData } from "./useWalletData";

const mockUser = {
  getId: vi.fn(() => "user-123"),
};

const mockAuthStore = vi.fn();

const mockBalance = Balance.create({
  amount: BalanceAmount.create(5000),
  currency: "MXN",
  userId: "user-123",
});

const mockUserProfile = UserProfile.create({
  fullName: "Test User",
  userId: "user-123",
});

vi.mock("#shared/infrastructure/hooks", () => ({
  useAuthContext: vi.fn(() => ({
    isAuthenticated: true,
    isLoading: false,
    user: mockUser,
  })),
}));

vi.mock("#wallet/balance/application", () => ({
  GetBalanceUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue(mockBalance),
  })),
  GetUserProfileUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue(mockUserProfile),
  })),
}));

vi.mock("#wallet/balance/infrastructure/repositories", () => ({
  WalletRepository: {
    getInstance: vi.fn().mockReturnValue({
      getBalance: vi.fn(),
      getUserProfile: vi.fn(),
    }),
  },
}));

describe("useWalletData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWalletStore.setState({
      balance: null,
      isLoading: false,
      userProfile: null,
    });
  });

  describe("Given an authenticated user", () => {
    describe("When the hook is called", () => {
      it("Then should return wallet data from store", async () => {
        const { result } = renderHook(() =>
          useWalletData({ authStore: mockAuthStore as never })
        );

        expect(result.current).toHaveProperty("balance");
        expect(result.current).toHaveProperty("userProfile");
        expect(result.current).toHaveProperty("isLoading");
      });
    });
  });

  describe("Given no authenticated user", () => {
    describe("When the hook is called", () => {
      it("Then should not load wallet data", async () => {
        const { useAuthContext } = await import("#shared/infrastructure/hooks");
        vi.mocked(useAuthContext).mockReturnValue({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });

        const { result } = renderHook(() =>
          useWalletData({ authStore: mockAuthStore as never })
        );

        await waitFor(() => {
          expect(result.current.balance).toBeNull();
          expect(result.current.userProfile).toBeNull();
          expect(result.current.isLoading).toBe(false);
        });
      });
    });
  });
});
