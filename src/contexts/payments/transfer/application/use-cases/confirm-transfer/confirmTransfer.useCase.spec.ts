import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import {
  ConfirmTransferResult,
  TransferRepository,
} from "#payments/transfer/domain/repositories";
import { TransferDate } from "#payments/transfer/domain/value-objects";
import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";
import { BalanceAmount } from "#wallet/domain/value-objects";

import { ConfirmTransferUseCase } from "./confirmTransfer.useCase";

describe("ConfirmTransferUseCase", () => {
  let transferRepository: TransferRepository;
  let walletRepository: WalletRepository;
  let useCase: ConfirmTransferUseCase;

  beforeEach(() => {
    transferRepository = {
      confirm: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
    };

    walletRepository = {
      getBalance: vi.fn(),
      getUserProfile: vi.fn(),
      updateBalance: vi.fn(),
    };

    useCase = new ConfirmTransferUseCase(transferRepository, walletRepository);
  });

  describe("Given a user with sufficient balance", () => {
    describe("When confirming a transfer", () => {
      it("Then should confirm transfer successfully and update balance", async () => {
        const currentBalance = Balance.create({
          amount: BalanceAmount.create(1000),
          currency: "MXN",
          userId: "user-1",
        });

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

        vi.mocked(walletRepository.getBalance).mockResolvedValue(
          currentBalance
        );
        vi.mocked(transferRepository.confirm).mockResolvedValue(confirmResult);
        vi.mocked(walletRepository.updateBalance).mockResolvedValue();

        const result = await useCase.execute({
          amount: 100,
          transferId: "transfer-1",
          userId: "user-1",
        });

        expect(result).toBe(mockTransfer);
        expect(walletRepository.getBalance).toHaveBeenCalledWith("user-1");
        expect(transferRepository.confirm).toHaveBeenCalledWith("transfer-1");
        expect(walletRepository.updateBalance).toHaveBeenCalled();
      });
    });
  });

  describe("Given a user with insufficient balance", () => {
    describe("When confirming a transfer", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const currentBalance = Balance.create({
          amount: BalanceAmount.create(50),
          currency: "MXN",
          userId: "user-1",
        });

        vi.mocked(walletRepository.getBalance).mockResolvedValue(
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
        expect(walletRepository.updateBalance).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given a successful transfer confirmation", () => {
    describe("When the transfer is confirmed", () => {
      it("Then should update the wallet balance correctly", async () => {
        const initialAmount = 1000;
        const transferAmount = 250;
        const expectedNewAmount = initialAmount - transferAmount;

        const currentBalance = Balance.create({
          amount: BalanceAmount.create(initialAmount),
          currency: "MXN",
          userId: "user-1",
        });

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

        vi.mocked(walletRepository.getBalance).mockResolvedValue(
          currentBalance
        );
        vi.mocked(transferRepository.confirm).mockResolvedValue(confirmResult);
        vi.mocked(walletRepository.updateBalance).mockResolvedValue();

        await useCase.execute({
          amount: transferAmount,
          transferId: "transfer-1",
          userId: "user-1",
        });

        expect(walletRepository.updateBalance).toHaveBeenCalledWith(
          "user-1",
          expect.objectContaining({
            getAmount: expect.any(Function),
            getCurrency: expect.any(Function),
            getUserId: expect.any(Function),
          })
        );

        const updateCall = vi.mocked(walletRepository.updateBalance).mock
          .calls[0];
        const updatedBalance = updateCall?.[1];

        if (updatedBalance) {
          expect(updatedBalance.getAmount().getValue()).toBe(expectedNewAmount);
        }
      });
    });
  });
});
