import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository } from "#payments/contact/domain/repositories";
import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferRepository } from "#payments/transfer/domain/repositories";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { AmountMustBeGreaterThanZeroError } from "#shared/domain/errors";
import { Amount, Email, Phone } from "#shared/domain/value-objects";
import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";

import { PrepareTransferUseCase } from "./prepareTransfer.useCase";

describe("PrepareTransferUseCase", () => {
  describe("Given amount is zero", () => {
    describe("When preparing a transfer", () => {
      it("Then should throw AmountMustBeGreaterThanZeroError", async () => {
        const mockWalletRepository: WalletRepository = {
          getBalance: vi.fn(),
          getUserProfile: vi.fn(),
          updateBalance: vi.fn(),
        };

        const mockTransferRepository: TransferRepository = {
          confirm: vi.fn(),
          create: vi.fn(),
          findById: vi.fn(),
          findByUserId: vi.fn(),
        };

        const mockContactRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn(),
          findByName: vi.fn(),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new PrepareTransferUseCase(
          mockTransferRepository,
          mockWalletRepository,
          mockContactRepository
        );

        await expect(
          useCase.execute({
            amount: 0,
            recipientId: "recipient-1",
            userId: "user-1",
          })
        ).rejects.toThrow(AmountMustBeGreaterThanZeroError);
      });
    });
  });

  describe("Given insufficient balance", () => {
    describe("When preparing a transfer", () => {
      it("Then should throw InsufficientBalanceError", async () => {
        const mockBalance = Balance.create({
          amount: Amount.create(50),
          currency: "MXN",
          userId: "user-1",
        });

        const mockWalletRepository: WalletRepository = {
          getBalance: vi.fn().mockResolvedValue(mockBalance),
          getUserProfile: vi.fn(),
          updateBalance: vi.fn(),
        };

        const mockTransferRepository: TransferRepository = {
          confirm: vi.fn(),
          create: vi.fn(),
          findById: vi.fn(),
          findByUserId: vi.fn(),
        };

        const mockContactRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn(),
          findByName: vi.fn(),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new PrepareTransferUseCase(
          mockTransferRepository,
          mockWalletRepository,
          mockContactRepository
        );

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
      it("Then should return transfer draft with transferId", async () => {
        const mockBalance = Balance.create({
          amount: Amount.create(1000),
          currency: "MXN",
          userId: "user-1",
        });

        const mockWalletRepository: WalletRepository = {
          getBalance: vi.fn().mockResolvedValue(mockBalance),
          getUserProfile: vi.fn(),
          updateBalance: vi.fn(),
        };

        const mockContact = Contact.create({
          email: Email.create("test@example.com"),
          id: "recipient-1",
          isFavorite: false,
          name: "Test Recipient",
          phone: Phone.create("+525512345678"),
        });

        const mockTransfer = Transfer.create({
          amount: Amount.create(100),
          date: new Date(),
          description: "Transferencia a Test Recipient",
          id: "transfer-123",
          recipientId: "recipient-1",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const mockTransferRepository: TransferRepository = {
          confirm: vi.fn(),
          create: vi.fn().mockResolvedValue(mockTransfer),
          findById: vi.fn(),
          findByUserId: vi.fn(),
        };

        const mockContactRepository: ContactRepository = {
          add: vi.fn(),
          findAll: vi.fn(),
          findByEmail: vi.fn(),
          findById: vi.fn().mockResolvedValue(mockContact),
          findByName: vi.fn(),
          findByPhone: vi.fn(),
          findFavorites: vi.fn(),
        };

        const useCase = new PrepareTransferUseCase(
          mockTransferRepository,
          mockWalletRepository,
          mockContactRepository
        );

        const result = await useCase.execute({
          amount: 100,
          recipientId: "recipient-1",
          userId: "user-1",
        });

        expect(result).toEqual({
          amount: 100,
          recipientId: "recipient-1",
          transferId: "transfer-123",
          userId: "user-1",
        });

        expect(mockTransferRepository.create).toHaveBeenCalledWith({
          amount: Amount.create(100),
          description: "Transferencia a Test Recipient",
          recipientId: "recipient-1",
          userId: "user-1",
        });
      });
    });
  });
});
