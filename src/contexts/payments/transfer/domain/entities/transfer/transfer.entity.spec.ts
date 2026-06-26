import { describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain/entities";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";

describe("Transfer", () => {
  describe("Given valid transfer parameters", () => {
    describe("When creating a transfer", () => {
      it("Then should create transfer successfully", () => {
        const transfer = Transfer.create({
          amount: 1500.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Test transfer",
          id: "txn-001",
          status: TransferStatus.success(),
          type: TransferType.expense(),
        });

        expect(transfer.getId()).toBe("txn-001");
        expect(transfer.getAmount()).toBe(1500.0);
        expect(transfer.getDescription()).toBe("Test transfer");
        expect(transfer.getStatus().isSuccess()).toBe(true);
        expect(transfer.getType().isExpense()).toBe(true);
      });
    });

    describe("When creating an income transfer", () => {
      it("Then should have income type", () => {
        const transfer = Transfer.create({
          amount: 2000.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Income",
          id: "txn-002",
          status: TransferStatus.success(),
          type: TransferType.income(),
        });

        expect(transfer.getType().isIncome()).toBe(true);
        expect(transfer.getType().isExpense()).toBe(false);
      });
    });

    describe("When creating a pending transfer", () => {
      it("Then should have pending status", () => {
        const transfer = Transfer.create({
          amount: 500.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Pending payment",
          id: "txn-003",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
        });

        expect(transfer.getStatus().isPending()).toBe(true);
        expect(transfer.getStatus().isSuccess()).toBe(false);
        expect(transfer.getStatus().isFailed()).toBe(false);
      });
    });

    describe("When creating a failed transfer", () => {
      it("Then should have failed status", () => {
        const transfer = Transfer.create({
          amount: 300.0,
          date: new Date("2024-06-25T10:00:00"),
          description: "Failed payment",
          id: "txn-004",
          status: TransferStatus.failed(),
          type: TransferType.expense(),
        });

        expect(transfer.getStatus().isFailed()).toBe(true);
        expect(transfer.getStatus().isSuccess()).toBe(false);
        expect(transfer.getStatus().isPending()).toBe(false);
      });
    });
  });

  describe("Given transfer date", () => {
    describe("When accessing transfer date", () => {
      it("Then should return TransferDate value object", () => {
        const inputDate = new Date("2024-06-25T10:00:00");
        const transfer = Transfer.create({
          amount: 1000.0,
          date: inputDate,
          description: "Test",
          id: "txn-005",
          status: TransferStatus.success(),
          type: TransferType.expense(),
        });

        const transferDate = transfer.getDate();
        expect(transferDate.getValue()).toEqual(inputDate);
      });
    });
  });
});
