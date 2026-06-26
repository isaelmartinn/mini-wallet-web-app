import { beforeEach, describe, expect, it } from "vitest";

import { Balance, UserProfile } from "#wallet/domain/entities";

import { WalletRepository } from "./wallet.repository";

describe("WalletRepository", () => {
  let repository: WalletRepository;
  const testUserId = "user-001";

  beforeEach(() => {
    repository = new WalletRepository();
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

        it("Then should return a new instance each time", async () => {
          const result1 = await repository.getBalance(testUserId);
          const result2 = await repository.getBalance(testUserId);

          expect(result1).not.toBe(result2);
          expect(result1.getAmount().getValue()).toBe(
            result2.getAmount().getValue()
          );
        });
      });

      describe("When fetching balance for unknown user", () => {
        it("Then should return balance with zero amount", async () => {
          const result = await repository.getBalance("unknown-user");

          expect(result.getAmount().getValue()).toBe(0);
          expect(result.getCurrency()).toBe("MXN");
          expect(result.getUserId()).toBe("unknown-user");
        });
      });
    });

    describe("Given request with delay", () => {
      describe("When fetching balance", () => {
        it("Then should take at least 500ms", async () => {
          const startTime = Date.now();

          await repository.getBalance(testUserId);

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeGreaterThanOrEqual(500);
        });

        it("Then should take less than 2000ms", async () => {
          const startTime = Date.now();

          await repository.getBalance(testUserId);

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeLessThan(2000);
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
        it("Then should return profile with default name", async () => {
          const result = await repository.getUserProfile("unknown-user");

          expect(result.getFullName()).toBe("Usuario Desconocido");
          expect(result.getUserId()).toBe("unknown-user");
        });
      });
    });

    describe("Given request with delay", () => {
      describe("When fetching user profile", () => {
        it("Then should take at least 500ms", async () => {
          const startTime = Date.now();

          await repository.getUserProfile(testUserId);

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeGreaterThanOrEqual(500);
        });

        it("Then should take less than 2000ms", async () => {
          const startTime = Date.now();

          await repository.getUserProfile(testUserId);

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeLessThan(2000);
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
