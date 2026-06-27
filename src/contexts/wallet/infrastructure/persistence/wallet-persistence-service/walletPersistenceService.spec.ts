import { beforeEach, describe, expect, it, vi } from "vitest";

import { Amount } from "#shared/domain/value-objects";
import { LocalStorageService } from "#shared/infrastructure/storage";
import { Balance } from "#wallet/domain/entities";

import { WalletPersistenceService } from "./walletPersistenceService";

describe("WalletPersistenceService", () => {
  let service: WalletPersistenceService;
  let mockStorageService: LocalStorageService;

  beforeEach(() => {
    mockStorageService = {
      get: vi.fn(),
      remove: vi.fn(),
      set: vi.fn(),
    } as unknown as LocalStorageService;

    service = new WalletPersistenceService(mockStorageService);
  });

  describe("Given a valid balance", () => {
    describe("When saving the balance", () => {
      it("Then should store serialized balance data", () => {
        const userId = "user-123";
        const balance = Balance.create({
          amount: Amount.create(1000),
          currency: "MXN",
          userId,
        });

        service.saveBalance(userId, balance);

        expect(mockStorageService.set).toHaveBeenCalledWith(
          "wallet:balance:user-123",
          {
            amount: 1000,
            currency: "MXN",
            userId: "user-123",
          }
        );
      });
    });
  });

  describe("Given a stored balance", () => {
    describe("When getting the balance", () => {
      it("Then should return reconstructed Balance entity", () => {
        const userId = "user-123";
        vi.mocked(mockStorageService.get).mockReturnValue({
          amount: 1000,
          currency: "MXN",
          userId: "user-123",
        });

        const result = service.getBalance(userId);

        expect(result).not.toBeNull();
        expect(result?.getAmount().getValue()).toBe(1000);
        expect(result?.getCurrency()).toBe("MXN");
        expect(result?.getUserId()).toBe("user-123");
      });
    });
  });

  describe("Given no stored balance", () => {
    describe("When getting the balance", () => {
      it("Then should return null", () => {
        const userId = "user-123";
        vi.mocked(mockStorageService.get).mockReturnValue(null);

        const result = service.getBalance(userId);

        expect(result).toBeNull();
      });
    });
  });

  describe("Given corrupted balance data", () => {
    describe("When getting the balance", () => {
      it("Then should return null and log error", () => {
        const userId = "user-123";
        const consoleErrorSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        vi.mocked(mockStorageService.get).mockReturnValue({
          amount: -1000,
          currency: "MXN",
          userId: "user-123",
        });

        const result = service.getBalance(userId);

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe("Given a stored balance", () => {
    describe("When clearing the balance", () => {
      it("Then should remove it from storage", () => {
        const userId = "user-123";

        service.clearBalance(userId);

        expect(mockStorageService.remove).toHaveBeenCalledWith(
          "wallet:balance:user-123"
        );
      });
    });
  });

  describe("Given multiple users", () => {
    describe("When saving balances for different users", () => {
      it("Then should use different storage keys", () => {
        const balance1 = Balance.create({
          amount: Amount.create(1000),
          currency: "MXN",
          userId: "user-1",
        });
        const balance2 = Balance.create({
          amount: Amount.create(2000),
          currency: "MXN",
          userId: "user-2",
        });

        service.saveBalance("user-1", balance1);
        service.saveBalance("user-2", balance2);

        expect(mockStorageService.set).toHaveBeenCalledWith(
          "wallet:balance:user-1",
          expect.objectContaining({ amount: 1000 })
        );
        expect(mockStorageService.set).toHaveBeenCalledWith(
          "wallet:balance:user-2",
          expect.objectContaining({ amount: 2000 })
        );
      });
    });
  });
});
