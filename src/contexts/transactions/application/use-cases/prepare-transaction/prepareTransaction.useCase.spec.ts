import { describe, expect, it, vi } from "vitest";

import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";
import { InsufficientBalanceError } from "#transactions/domain/errors";
import { TransactionValidationService } from "#transactions/domain/services";

import { PrepareTransactionUseCase } from "./prepareTransaction.useCase";

describe("PrepareTransactionUseCase", () => {
  describe("Given insufficient balance", () => {
    describe("When preparing a transaction", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(50),
        };

        const validationService = new TransactionValidationService(
          mockBalanceProvider
        );
        const useCase = new PrepareTransactionUseCase(validationService);

        await expect(
          useCase.execute({
            amount: 100,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).rejects.toThrow(InsufficientBalanceError);
      });
    });
  });

  describe("Given valid transaction data", () => {
    describe("When preparing a transaction", () => {
      it("Then should return transaction draft", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(1000),
        };

        const validationService = new TransactionValidationService(
          mockBalanceProvider
        );
        const useCase = new PrepareTransactionUseCase(validationService);

        const result = await useCase.execute({
          amount: 100,
          recipientId: "recipient-1",
          userId: "user-1",
        });

        expect(result).toEqual({
          amount: 100,
          recipientId: "recipient-1",
          userId: "user-1",
        });
      });
    });
  });
});
