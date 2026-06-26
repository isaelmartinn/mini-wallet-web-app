import { describe, expect, it, vi } from "vitest";

import {
  InsufficientBalanceError,
  InvalidAmountError,
  RecipientRequiredError,
} from "#payments/transfer/domain/errors";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";

import { TransferValidationService } from "./transferValidation.service";

describe("TransferValidationService", () => {
  describe("Given a transfer with invalid amount", () => {
    describe("When amount is zero", () => {
      it("Then should throw InvalidAmountError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn(),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: 0,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).rejects.toThrow(InvalidAmountError);
      });
    });

    describe("When amount is negative", () => {
      it("Then should throw InvalidAmountError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn(),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: -100,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).rejects.toThrow(InvalidAmountError);
      });
    });
  });

  describe("Given a transfer without recipient", () => {
    describe("When recipientId is empty", () => {
      it("Then should throw RecipientRequiredError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn(),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: 100,
            recipientId: "",
            userId: "user-1",
          })
        ).rejects.toThrow(RecipientRequiredError);
      });
    });

    describe("When recipientId is only whitespace", () => {
      it("Then should throw RecipientRequiredError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn(),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: 100,
            recipientId: "   ",
            userId: "user-1",
          })
        ).rejects.toThrow(RecipientRequiredError);
      });
    });
  });

  describe("Given a user with insufficient balance", () => {
    describe("When transfer amount exceeds available balance", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(50),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: 100,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).rejects.toThrow(InsufficientBalanceError);
      });
    });
  });

  describe("Given a valid transfer", () => {
    describe("When all validations pass", () => {
      it("Then should not throw any error", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(1000),
        };

        const service = new TransferValidationService(mockBalanceProvider);

        await expect(
          service.validateTransfer({
            amount: 100,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).resolves.not.toThrow();
      });
    });
  });
});
