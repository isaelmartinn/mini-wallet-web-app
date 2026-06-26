import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetTransactionsUseCase } from "#transactions/application/use-cases/get-transactions/getTransactions.useCase";
import { Transaction, TransactionRepository } from "#transactions/domain";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

describe("GetTransactionsUseCase", () => {
  let mockRepository: TransactionRepository;
  let useCase: GetTransactionsUseCase;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
    };
    useCase = new GetTransactionsUseCase(mockRepository);
  });

  describe("Given a repository with transactions", () => {
    describe("When executing the use case", () => {
      it("Then should return all transactions", async () => {
        const mockTransactions = [
          Transaction.create({
            amount: 1000,
            date: new Date("2024-06-25"),
            description: "Transaction 1",
            id: "1",
            status: TransactionStatus.success(),
            type: TransactionType.expense(),
          }),
          Transaction.create({
            amount: 2000,
            date: new Date("2024-06-24"),
            description: "Transaction 2",
            id: "2",
            status: TransactionStatus.success(),
            type: TransactionType.income(),
          }),
        ];

        vi.mocked(mockRepository.findAll).mockResolvedValue(mockTransactions);

        const result = await useCase.execute();

        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledOnce();
      });
    });

    describe("When transactions are in random order", () => {
      it("Then should return transactions sorted by date (most recent first)", async () => {
        const oldTransaction = Transaction.create({
          amount: 1000,
          date: new Date("2024-06-20"),
          description: "Old transaction",
          id: "1",
          status: TransactionStatus.success(),
          type: TransactionType.expense(),
        });

        const recentTransaction = Transaction.create({
          amount: 2000,
          date: new Date("2024-06-25"),
          description: "Recent transaction",
          id: "2",
          status: TransactionStatus.success(),
          type: TransactionType.income(),
        });

        const middleTransaction = Transaction.create({
          amount: 1500,
          date: new Date("2024-06-23"),
          description: "Middle transaction",
          id: "3",
          status: TransactionStatus.pending(),
          type: TransactionType.expense(),
        });

        vi.mocked(mockRepository.findAll).mockResolvedValue([
          oldTransaction,
          recentTransaction,
          middleTransaction,
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
