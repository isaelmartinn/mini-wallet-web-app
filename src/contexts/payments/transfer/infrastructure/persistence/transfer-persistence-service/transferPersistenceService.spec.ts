import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transfer } from "#payments/transfer/domain/entities";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { TransferAmount } from "#payments/transfer/domain/value-objects";
import { LocalStorageService } from "#shared/infrastructure/storage";

import { TransferPersistenceService } from "./transferPersistenceService";

describe("TransferPersistenceService", () => {
  let service: TransferPersistenceService;
  let mockStorageService: LocalStorageService;

  beforeEach(() => {
    mockStorageService = {
      get: vi.fn(),
      remove: vi.fn(),
      set: vi.fn(),
    } as unknown as LocalStorageService;

    service = new TransferPersistenceService(mockStorageService);
  });

  describe("Given valid transfers", () => {
    describe("When saving transfers", () => {
      it("Then should store serialized transfer data", () => {
        const userId = "user-123";
        const transfers = [
          Transfer.create({
            amount: TransferAmount.create(1000),
            date: new Date("2024-01-15T10:00:00Z"),
            description: "Test transfer",
            id: "transfer-1",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId,
          }),
        ];

        service.saveTransfers(userId, transfers);

        expect(mockStorageService.set).toHaveBeenCalledWith(
          "payments:transfers:user-123",
          [
            {
              amount: 1000,
              date: "2024-01-15T10:00:00.000Z",
              description: "Test transfer",
              id: "transfer-1",
              recipientId: "recipient-1",
              status: "SUCCESS",
              type: "EXPENSE",
              userId: "user-123",
            },
          ]
        );
      });
    });
  });

  describe("Given stored transfers", () => {
    describe("When getting transfers", () => {
      it("Then should return reconstructed Transfer entities", () => {
        const userId = "user-123";
        vi.mocked(mockStorageService.get).mockReturnValue([
          {
            amount: 1000,
            date: "2024-01-15T10:00:00.000Z",
            description: "Test transfer",
            id: "transfer-1",
            recipientId: "recipient-1",
            status: "SUCCESS",
            type: "EXPENSE",
            userId: "user-123",
          },
        ]);

        const result = service.getTransfers(userId);

        expect(result).not.toBeNull();
        expect(result).toHaveLength(1);
        expect(result?.[0].getAmount().getValue()).toBe(1000);
        expect(result?.[0].getDescription()).toBe("Test transfer");
        expect(result?.[0].getStatus().getValue()).toBe("SUCCESS");
        expect(result?.[0].getType().getValue()).toBe("EXPENSE");
      });
    });
  });

  describe("Given no stored transfers", () => {
    describe("When getting transfers", () => {
      it("Then should return null", () => {
        const userId = "user-123";
        vi.mocked(mockStorageService.get).mockReturnValue(null);

        const result = service.getTransfers(userId);

        expect(result).toBeNull();
      });
    });
  });

  describe("Given corrupted transfer data", () => {
    describe("When getting transfers", () => {
      it("Then should return null and log error", () => {
        const userId = "user-123";
        const consoleErrorSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        vi.mocked(mockStorageService.get).mockReturnValue([
          {
            amount: "invalid",
            date: "invalid-date",
          },
        ]);

        const result = service.getTransfers(userId);

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe("Given stored transfers", () => {
    describe("When clearing transfers", () => {
      it("Then should remove them from storage", () => {
        const userId = "user-123";

        service.clearTransfers(userId);

        expect(mockStorageService.remove).toHaveBeenCalledWith(
          "payments:transfers:user-123"
        );
      });
    });
  });

  describe("Given multiple users", () => {
    describe("When saving transfers for different users", () => {
      it("Then should use different storage keys", () => {
        const transfer1 = Transfer.create({
          amount: TransferAmount.create(1000),
          date: new Date(),
          description: "Transfer 1",
          id: "transfer-1",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const transfer2 = Transfer.create({
          amount: TransferAmount.create(2000),
          date: new Date(),
          description: "Transfer 2",
          id: "transfer-2",
          recipientId: "recipient-2",
          status: TransferStatus.pending(),
          type: TransferType.income(),
          userId: "user-2",
        });

        service.saveTransfers("user-1", [transfer1]);
        service.saveTransfers("user-2", [transfer2]);

        expect(mockStorageService.set).toHaveBeenCalledWith(
          "payments:transfers:user-1",
          expect.arrayContaining([expect.objectContaining({ amount: 1000 })])
        );
        expect(mockStorageService.set).toHaveBeenCalledWith(
          "payments:transfers:user-2",
          expect.arrayContaining([expect.objectContaining({ amount: 2000 })])
        );
      });
    });
  });
});
