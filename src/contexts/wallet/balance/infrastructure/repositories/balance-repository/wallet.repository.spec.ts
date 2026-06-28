import { beforeEach, describe, expect, it, vi } from "vitest";

import { Balance } from "#wallet/balance/domain/entities";
import { UserProfile } from "#wallet/user-profile/domain/entities";

import { WalletRepository } from "./wallet.repository";

describe("WalletRepository", () => {
  let repository: WalletRepository;
  const testUserId = "user-001";

  beforeEach(() => {
    WalletRepository.resetInstance();
    repository = WalletRepository.getInstance();
    localStorage.clear();
    vi.clearAllMocks();

    global.fetch = vi.fn((url) => {
      const urlStr = url.toString();

      if (urlStr.includes("/api/wallet/balance")) {
        return Promise.resolve({
          json: async () => ({
            amount: 5000,
            currency: "MXN",
          }),
          ok: true,
          status: 200,
        } as Response);
      }

      if (urlStr.includes("/api/wallet/profile")) {
        return Promise.resolve({
          json: async () => ({
            fullName: "Usuario de Prueba",
          }),
          ok: true,
          status: 200,
        } as Response);
      }

      return Promise.resolve({
        json: async () => ({ error: "NOT_FOUND" }),
        ok: false,
        status: 404,
      } as Response);
    }) as unknown as typeof fetch;
  });

  describe("getBalance", () => {
    describe("Given successful scenario", () => {
      describe("When fetching balance for a user", () => {
        it("Then should return a Balance instance", async () => {
          const result = await repository.getBalance(testUserId);

          expect(result).toBeInstanceOf(Balance);
        });

        it("Then should return balance with correct userId", async () => {
          const result = await repository.getBalance(testUserId);

          expect(result.getUserId()).toBe(testUserId);
        });

        it("Then should return balance with valid amount", async () => {
          const result = await repository.getBalance(testUserId);

          const amount = result.getAmount();
          expect(amount.getValue()).toBeGreaterThanOrEqual(0);
          expect(typeof amount.getValue()).toBe("number");
        });

        it("Then should return balance with valid currency", async () => {
          const result = await repository.getBalance(testUserId);

          expect(result.getCurrency()).toBe("MXN");
        });

        it("Then should return the same cached instance", async () => {
          const result1 = await repository.getBalance(testUserId);
          const result2 = await repository.getBalance(testUserId);

          expect(result1).toBe(result2);
          expect(result1.getAmount().getValue()).toBe(
            result2.getAmount().getValue()
          );
        });
      });

      describe("When fetching balance for unknown user", () => {
        it("Then should return balance with mocked amount", async () => {
          const result = await repository.getBalance("unknown-user");

          expect(result.getAmount().getValue()).toBe(5000);
          expect(result.getCurrency()).toBe("MXN");
          expect(result.getUserId()).toBe("unknown-user");
        });
      });
    });
  });

  describe("getUserProfile", () => {
    describe("Given successful scenario", () => {
      describe("When fetching user profile", () => {
        it("Then should return a UserProfile instance", async () => {
          const result = await repository.getUserProfile(testUserId);

          expect(result).toBeInstanceOf(UserProfile);
        });

        it("Then should return profile with correct userId", async () => {
          const result = await repository.getUserProfile(testUserId);

          expect(result.getUserId()).toBe(testUserId);
        });

        it("Then should return profile with non-empty fullName", async () => {
          const result = await repository.getUserProfile(testUserId);

          expect(result.getFullName().length).toBeGreaterThan(0);
        });

        it("Then should return profile with valid initials", async () => {
          const result = await repository.getUserProfile(testUserId);

          const initials = result.getInitials();
          expect(initials.length).toBeGreaterThan(0);
          expect(initials.length).toBeLessThanOrEqual(2);
          expect(initials).toMatch(/^[A-Z]{1,2}$/);
        });

        it("Then should return a new instance each time", async () => {
          const result1 = await repository.getUserProfile(testUserId);
          const result2 = await repository.getUserProfile(testUserId);

          expect(result1).not.toBe(result2);
          expect(result1.getFullName()).toBe(result2.getFullName());
        });
      });

      describe("When fetching profile for unknown user", () => {
        it("Then should return profile with mocked name", async () => {
          const result = await repository.getUserProfile("unknown-user");

          expect(result.getFullName()).toBe("Usuario de Prueba");
          expect(result.getUserId()).toBe("unknown-user");
        });
      });
    });
  });

  describe("Given data integrity", () => {
    describe("When fetching multiple times", () => {
      it("Then should return consistent balance data", async () => {
        const results = await Promise.all([
          repository.getBalance(testUserId),
          repository.getBalance(testUserId),
          repository.getBalance(testUserId),
        ]);

        const amounts = results.map((r) => r.getAmount().getValue());
        const currencies = results.map((r) => r.getCurrency());
        const userIds = results.map((r) => r.getUserId());

        expect(new Set(amounts).size).toBe(1);
        expect(new Set(currencies).size).toBe(1);
        expect(new Set(userIds).size).toBe(1);
      });

      it("Then should return consistent profile data", async () => {
        const results = await Promise.all([
          repository.getUserProfile(testUserId),
          repository.getUserProfile(testUserId),
          repository.getUserProfile(testUserId),
        ]);

        const fullNames = results.map((r) => r.getFullName());
        const userIds = results.map((r) => r.getUserId());

        expect(new Set(fullNames).size).toBe(1);
        expect(new Set(userIds).size).toBe(1);
      });
    });
  });
});
