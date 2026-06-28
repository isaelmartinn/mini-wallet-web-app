import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transfer, TransferRepository } from "#payments/transfer/domain";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { TransferAmount } from "#payments/transfer/domain/value-objects";

import { GetTransfersUseCase } from "./getTransfers.useCase";

describe("GetTransfersUseCase", () => {
  let mockRepository: TransferRepository;
  let useCase: GetTransfersUseCase;

  beforeEach(() => {
    mockRepository = {
      confirm: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
    };
    useCase = new GetTransfersUseCase(mockRepository);
  });

  describe("Given a repository with transfers", () => {
    describe("When executing the use case", () => {
      it("Then should return all transfers", async () => {
        const mockTransfers = [
          Transfer.create({
            amount: TransferAmount.create(1000),
            date: new Date("2024-06-25"),
            description: "Transfer 1",
            id: "1",
            recipientId: "contact-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
          Transfer.create({
            amount: TransferAmount.create(2000),
            date: new Date("2024-06-24"),
            description: "Transfer 2",
            id: "2",
            recipientId: "contact-2",
            status: TransferStatus.success(),
            type: TransferType.income(),
            userId: "user-1",
          }),
        ];

        vi.mocked(mockRepository.findByUserId).mockResolvedValue(mockTransfers);

        const result = await useCase.execute({ userId: "user-1" });

        expect(result).toHaveLength(2);
        expect(mockRepository.findByUserId).toHaveBeenCalledWith("user-1");
      });
    });

    describe("When transfers are in random order", () => {
      it("Then should return transfers sorted by date (most recent first)", async () => {
        const oldTransfer = Transfer.create({
          amount: TransferAmount.create(1000),
          date: new Date("2024-06-20"),
          description: "Old transfer",
          id: "1",
          recipientId: "contact-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const recentTransfer = Transfer.create({
          amount: TransferAmount.create(2000),
          date: new Date("2024-06-25"),
          description: "Recent transfer",
          id: "2",
          recipientId: "contact-2",
          status: TransferStatus.success(),
          type: TransferType.income(),
          userId: "user-1",
        });

        const middleTransfer = Transfer.create({
          amount: TransferAmount.create(1500),
          date: new Date("2024-06-23"),
          description: "Middle transfer",
          id: "3",
          recipientId: "contact-3",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        vi.mocked(mockRepository.findByUserId).mockResolvedValue([
          oldTransfer,
          recentTransfer,
          middleTransfer,
        ]);

        const result = await useCase.execute({ userId: "user-1" });

        expect(result[0]?.getId()).toBe("2");
        expect(result[1]?.getId()).toBe("3");
        expect(result[2]?.getId()).toBe("1");
      });
    });
  });

  describe("Given an empty repository", () => {
    describe("When executing the use case", () => {
      it("Then should return an empty array", async () => {
        vi.mocked(mockRepository.findByUserId).mockResolvedValue([]);

        const result = await useCase.execute({ userId: "user-1" });

        expect(result).toHaveLength(0);
        expect(mockRepository.findByUserId).toHaveBeenCalledWith("user-1");
      });
    });
  });

  describe("Given a repository that throws an error", () => {
    describe("When executing the use case", () => {
      it("Then should propagate the error", async () => {
        const error = new Error("Repository error");
        vi.mocked(mockRepository.findByUserId).mockRejectedValue(error);

        await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
          "Repository error"
        );
      });
    });
  });
});
