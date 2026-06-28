import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import {
  ConfirmTransferResult,
  TransferRepository,
} from "#payments/transfer/domain/repositories";
import { TransferDate } from "#payments/transfer/domain/value-objects";
import { BalanceProvider } from "#shared/domain/interfaces";

import { ConfirmTransferUseCase } from "./confirmTransfer.useCase";

describe("ConfirmTransferUseCase", () => {
  let transferRepository: TransferRepository;
  let balanceProvider: BalanceProvider;
  let useCase: ConfirmTransferUseCase;

  beforeEach(() => {
    transferRepository = {
      confirm: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
    };

    balanceProvider = {
      getAvailableBalance: vi.fn(),
      updateBalance: vi.fn(),
    };

    useCase = new ConfirmTransferUseCase(transferRepository, balanceProvider);
  });

  describe("Given a user with sufficient balance", () => {
    describe("When confirming a transfer", () => {
      it("Then should confirm transfer successfully and update balance", async () => {
        const currentBalance = 1000;

        const mockTransfer = {
          getAmount: () => 100,
          getDate: () => TransferDate.create(new Date()),
          getDescription: () => "Test transfer",
          getId: () => "transfer-1",
          getStatus: () => ({ getValue: () => "completed" }),
          getType: () => ({ getValue: () => "sent" }),
        } as unknown as Transfer;

        const confirmResult: ConfirmTransferResult = {
          success: true,
          transfer: mockTransfer,
        };

        vi.mocked(balanceProvider.getAvailableBalance).mockResolvedValue(
          currentBalance
        );
        vi.mocked(transferRepository.confirm).mockResolvedValue(confirmResult);
        vi.mocked(balanceProvider.updateBalance).mockResolvedValue();

        const result = await useCase.execute({
          amount: 100,
          transferId: "transfer-1",
          userId: "user-1",
        });

        expect(result).toBe(mockTransfer);
        expect(balanceProvider.getAvailableBalance).toHaveBeenCalledWith(
          "user-1"
        );
        expect(transferRepository.confirm).toHaveBeenCalledWith("transfer-1");
        expect(balanceProvider.updateBalance).toHaveBeenCalledWith(
          "user-1",
          900
        );
      });
    });
  });

  describe("Given a user with insufficient balance", () => {
    describe("When confirming a transfer", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const currentBalance = 50;

        vi.mocked(balanceProvider.getAvailableBalance).mockResolvedValue(
          currentBalance
        );

        await expect(
          useCase.execute({
            amount: 100,
            transferId: "transfer-1",
            userId: "user-1",
          })
        ).rejects.toThrow(InsufficientBalanceError);

        expect(transferRepository.confirm).not.toHaveBeenCalled();
        expect(balanceProvider.updateBalance).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given a successful transfer confirmation", () => {
    describe("When the transfer is confirmed", () => {
      it("Then should update the wallet balance correctly", async () => {
        const initialAmount = 1000;
        const transferAmount = 250;
        const expectedNewAmount = initialAmount - transferAmount;

        const mockTransfer = {
          getAmount: () => transferAmount,
          getDate: () => TransferDate.create(new Date()),
          getDescription: () => "Test",
          getId: () => "transfer-1",
          getStatus: () => ({ getValue: () => "completed" }),
          getType: () => ({ getValue: () => "sent" }),
        } as unknown as Transfer;

        const confirmResult: ConfirmTransferResult = {
          success: true,
          transfer: mockTransfer,
        };

        vi.mocked(balanceProvider.getAvailableBalance).mockResolvedValue(
          initialAmount
        );
        vi.mocked(transferRepository.confirm).mockResolvedValue(confirmResult);
        vi.mocked(balanceProvider.updateBalance).mockResolvedValue();

        await useCase.execute({
          amount: transferAmount,
          transferId: "transfer-1",
          userId: "user-1",
        });

        expect(balanceProvider.updateBalance).toHaveBeenCalledWith(
          "user-1",
          expectedNewAmount
        );
      });
    });
  });
});
