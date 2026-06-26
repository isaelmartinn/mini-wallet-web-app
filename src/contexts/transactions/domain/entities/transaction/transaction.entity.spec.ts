import { describe, expect, it } from "vitest";

import { Transaction } from "#transactions/domain/entities/transaction/transaction.entity";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

describe("Transaction", () => {
  describe("Given valid transaction parameters", () => {
    describe("When creating a transaction", () => {
      it("Then should create transaction successfully", () => {
        const transaction = Transaction.create({
          amount: 1500.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Test transaction",
          id: "txn-001",
          status: TransactionStatus.success(),
          type: TransactionType.expense(),
        });

        expect(transaction.getId()).toBe("txn-001");
        expect(transaction.getAmount()).toBe(1500.0);
        expect(transaction.getDescription()).toBe("Test transaction");
        expect(transaction.getStatus().isSuccess()).toBe(true);
        expect(transaction.getType().isExpense()).toBe(true);
      });
    });

    describe("When creating an income transaction", () => {
      it("Then should have income type", () => {
        const transaction = Transaction.create({
          amount: 2000.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Income",
          id: "txn-002",
          status: TransactionStatus.success(),
          type: TransactionType.income(),
        });

        expect(transaction.getType().isIncome()).toBe(true);
        expect(transaction.getType().isExpense()).toBe(false);
      });
    });

    describe("When creating a pending transaction", () => {
      it("Then should have pending status", () => {
        const transaction = Transaction.create({
          amount: 500.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Pending payment",
          id: "txn-003",
          status: TransactionStatus.pending(),
          type: TransactionType.expense(),
        });

        expect(transaction.getStatus().isPending()).toBe(true);
        expect(transaction.getStatus().isSuccess()).toBe(false);
        expect(transaction.getStatus().isFailed()).toBe(false);
      });
    });

    describe("When creating a failed transaction", () => {
      it("Then should have failed status", () => {
        const transaction = Transaction.create({
          amount: 300.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Failed payment",
          id: "txn-004",
          status: TransactionStatus.failed(),
          type: TransactionType.expense(),
        });

        expect(transaction.getStatus().isFailed()).toBe(true);
        expect(transaction.getStatus().isSuccess()).toBe(false);
        expect(transaction.getStatus().isPending()).toBe(false);
      });
    });
  });

  describe("Given transaction date", () => {
    describe("When accessing transaction date", () => {
      it("Then should return TransactionDate value object", () => {
        const inputDate = new Date("2024-06-25T10:00:00");
        const transaction = Transaction.create({
          amount: 1000.0,
          date: inputDate,
          description: "Test",
          id: "txn-005",
          status: TransactionStatus.success(),
          type: TransactionType.expense(),
        });

        const transactionDate = transaction.getDate();
        expect(transactionDate.getValue()).toEqual(inputDate);
      });
    });
  });
});
