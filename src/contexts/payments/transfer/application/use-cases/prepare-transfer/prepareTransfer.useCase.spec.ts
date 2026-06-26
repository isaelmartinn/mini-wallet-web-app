import { describe, expect, it, vi } from "vitest";

import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferValidationService } from "#payments/transfer/domain/services";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";

import { PrepareTransferUseCase } from "./prepareTransfer.useCase";

describe("PrepareTransferUseCase", () => {
  describe("Given insufficient balance", () => {
    describe("When preparing a transfer", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(50),
        };

        const validationService = new TransferValidationService(
          mockBalanceProvider
        );
        const useCase = new PrepareTransferUseCase(validationService);

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

  describe("Given valid transfer data", () => {
    describe("When preparing a transfer", () => {
      it("Then should return transfer draft", async () => {
        const mockBalanceProvider: BalanceProvider = {
          getAvailableBalance: vi.fn().mockResolvedValue(1000),
        };

        const validationService = new TransferValidationService(
          mockBalanceProvider
        );
        const useCase = new PrepareTransferUseCase(validationService);

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
