import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transfer, TransferRepository } from "#payments/transfer/domain";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";

import { GetTransfersUseCase } from "./getTransfers.useCase";

describe("GetTransfersUseCase", () => {
  let mockRepository: TransferRepository;
  let useCase: GetTransfersUseCase;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
    };
    useCase = new GetTransfersUseCase(mockRepository);
  });

  describe("Given a repository with transfers", () => {
    describe("When executing the use case", () => {
      it("Then should return all transfers", async () => {
        const mockTransfers = [
          Transfer.create({
            amount: 1000,
            date: new Date("2024-06-25"),
            description: "Transfer 1",
            id: "1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
          }),
          Transfer.create({
            amount: 2000,
            date: new Date("2024-06-24"),
            description: "Transfer 2",
            id: "2",
            status: TransferStatus.success(),
            type: TransferType.income(),
          }),
        ];

        vi.mocked(mockRepository.findAll).mockResolvedValue(mockTransfers);

        const result = await useCase.execute();

        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledOnce();
      });
    });

    describe("When transfers are in random order", () => {
      it("Then should return transfers sorted by date (most recent first)", async () => {
        const oldTransfer = Transfer.create({
          amount: 1000,
          date: new Date("2024-06-20"),
          description: "Old transfer",
          id: "1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
        });

        const recentTransfer = Transfer.create({
          amount: 2000,
          date: new Date("2024-06-25"),
          description: "Recent transfer",
          id: "2",
          status: TransferStatus.success(),
          type: TransferType.income(),
        });

        const middleTransfer = Transfer.create({
          amount: 1500,
          date: new Date("2024-06-23"),
          description: "Middle transfer",
          id: "3",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
        });

        vi.mocked(mockRepository.findAll).mockResolvedValue([
          oldTransfer,
          recentTransfer,
          middleTransfer,
        ]);

        const result = await useCase.execute();

        expect(result[0]?.getId()).toBe("2");
        expect(result[1]?.getId()).toBe("3");
        expect(result[2]?.getId()).toBe("1");
      });
    });
  });

  describe("Given an empty repository", () => {
    describe("When executing the use case", () => {
      it("Then should return an empty array", async () => {
        vi.mocked(mockRepository.findAll).mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toHaveLength(0);
        expect(mockRepository.findAll).toHaveBeenCalledOnce();
      });
    });
  });

  describe("Given a repository that throws an error", () => {
    describe("When executing the use case", () => {
      it("Then should propagate the error", async () => {
        const error = new Error("Repository error");
        vi.mocked(mockRepository.findAll).mockRejectedValue(error);

        await expect(useCase.execute()).rejects.toThrow("Repository error");
      });
    });
  });
});
