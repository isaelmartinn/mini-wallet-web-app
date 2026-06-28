import { describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain/entities";
import {
  InvalidDescriptionError,
  InvalidStateTransitionError,
  RecipientRequiredError,
} from "#payments/transfer/domain/errors";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { TransferAmount } from "#payments/transfer/domain/value-objects";

describe("Transfer", () => {
  describe("Given valid transfer parameters", () => {
    describe("When creating a transfer", () => {
      it("Then should create transfer successfully", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1500.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test transfer",
          id: "txn-001",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(transfer.getId()).toBe("txn-001");
        expect(transfer.getAmount().getValue()).toBe(1500.0);
        expect(transfer.getDescription()).toBe("Test transfer");
        expect(transfer.getStatus().isSuccess()).toBe(true);
        expect(transfer.getType().isExpense()).toBe(true);
        expect(transfer.getUserId()).toBe("user-1");
      });
    });

    describe("When creating an income transfer", () => {
      it("Then should have income type", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(2000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Income",
          id: "txn-002",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.income(),
          userId: "user-1",
        });

        expect(transfer.getType().isIncome()).toBe(true);
        expect(transfer.getType().isExpense()).toBe(false);
      });
    });

    describe("When creating a pending transfer", () => {
      it("Then should have pending status", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(500.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Pending payment",
          id: "txn-003",
          recipientId: "recipient-1",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(transfer.getStatus().isPending()).toBe(true);
        expect(transfer.getStatus().isSuccess()).toBe(false);
        expect(transfer.getStatus().isFailed()).toBe(false);
      });
    });

    describe("When creating a failed transfer", () => {
      it("Then should have failed status", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(300.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Failed payment",
          id: "txn-004",
          recipientId: "recipient-1",
          status: TransferStatus.failed(),
          type: TransferType.expense(),
          userId: "user-1",
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
          amount: TransferAmount.create(1000.0),
          date: inputDate,
          description: "Test",
          id: "txn-005",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const transferDate = transfer.getDate();
        expect(transferDate.getValue()).toEqual(inputDate);
      });
    });
  });

  describe("Given transfer with userId", () => {
    describe("When accessing userId", () => {
      it("Then should return the correct userId", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-006",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-2",
        });

        expect(transfer.getUserId()).toBe("user-2");
      });
    });
  });

  describe("Given invalid recipientId", () => {
    describe("When recipientId is empty", () => {
      it("Then should throw RecipientRequiredError", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "Test",
            id: "txn-007",
            recipientId: "",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(RecipientRequiredError);
      });
    });

    describe("When recipientId is only whitespace", () => {
      it("Then should throw RecipientRequiredError", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "Test",
            id: "txn-008",
            recipientId: "   ",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(RecipientRequiredError);
      });
    });
  });

  describe("Given invalid description", () => {
    describe("When description is empty", () => {
      it("Then should throw InvalidDescriptionError", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "",
            id: "txn-009",
            recipientId: "recipient-1",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(InvalidDescriptionError);
      });
    });

    describe("When description is only whitespace", () => {
      it("Then should throw InvalidDescriptionError", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "   ",
            id: "txn-010",
            recipientId: "recipient-1",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(InvalidDescriptionError);
      });
    });
  });

  describe("Given a pending transfer", () => {
    describe("When confirming the transfer", () => {
      it("Then should transition to success status", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-011",
          recipientId: "recipient-1",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const confirmedTransfer = transfer.confirm();

        expect(confirmedTransfer.getStatus().isSuccess()).toBe(true);
        expect(confirmedTransfer.getId()).toBe(transfer.getId());
        expect(confirmedTransfer.getAmount().getValue()).toBe(
          transfer.getAmount().getValue()
        );
      });
    });

    describe("When failing the transfer", () => {
      it("Then should transition to failed status", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-012",
          recipientId: "recipient-1",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const failedTransfer = transfer.fail();

        expect(failedTransfer.getStatus().isFailed()).toBe(true);
        expect(failedTransfer.getId()).toBe(transfer.getId());
      });
    });

    describe("When cancelling the transfer", () => {
      it("Then should transition to failed status", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-013",
          recipientId: "recipient-1",
          status: TransferStatus.pending(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        const cancelledTransfer = transfer.cancel();

        expect(cancelledTransfer.getStatus().isFailed()).toBe(true);
        expect(cancelledTransfer.getId()).toBe(transfer.getId());
      });
    });
  });

  describe("Given a successful transfer", () => {
    describe("When trying to confirm again", () => {
      it("Then should throw InvalidStateTransitionError", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-014",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(() => transfer.confirm()).toThrow(InvalidStateTransitionError);
      });
    });

    describe("When trying to fail", () => {
      it("Then should throw InvalidStateTransitionError", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-015",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(() => transfer.fail()).toThrow(InvalidStateTransitionError);
      });
    });

    describe("When trying to cancel", () => {
      it("Then should throw InvalidStateTransitionError", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-016",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(() => transfer.cancel()).toThrow(InvalidStateTransitionError);
      });
    });
  });

  describe("Given a failed transfer", () => {
    describe("When trying to confirm", () => {
      it("Then should throw InvalidStateTransitionError", () => {
        const transfer = Transfer.create({
          amount: TransferAmount.create(1000.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Test",
          id: "txn-017",
          recipientId: "recipient-1",
          status: TransferStatus.failed(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(() => transfer.confirm()).toThrow(InvalidStateTransitionError);
      });
    });
  });

  describe("Given rehydrating a transfer from persistence", () => {
    describe("When rehydrating with valid data", () => {
      it("Then should reconstruct transfer without validations", () => {
        const transfer = Transfer.rehydrate({
          amount: TransferAmount.create(1500.0),
          date: new Date("2024-06-25T10:00:00"),
          description: "Rehydrated transfer",
          id: "txn-018",
          recipientId: "recipient-1",
          status: TransferStatus.success(),
          type: TransferType.expense(),
          userId: "user-1",
        });

        expect(transfer.getId()).toBe("txn-018");
        expect(transfer.getAmount().getValue()).toBe(1500.0);
        expect(transfer.getDescription()).toBe("Rehydrated transfer");
        expect(transfer.getRecipientId()).toBe("recipient-1");
        expect(transfer.getStatus().isSuccess()).toBe(true);
        expect(transfer.getType().isExpense()).toBe(true);
        expect(transfer.getUserId()).toBe("user-1");
      });
    });

    describe("When rehydrating with empty recipientId", () => {
      it("Then should NOT throw RecipientRequiredError", () => {
        expect(() =>
          Transfer.rehydrate({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "Test",
            id: "txn-019",
            recipientId: "",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).not.toThrow(RecipientRequiredError);
      });

      it("Then create() should throw RecipientRequiredError for comparison", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "Test",
            id: "txn-020",
            recipientId: "",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(RecipientRequiredError);
      });
    });

    describe("When rehydrating with empty description", () => {
      it("Then should NOT throw InvalidDescriptionError", () => {
        expect(() =>
          Transfer.rehydrate({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "",
            id: "txn-021",
            recipientId: "recipient-1",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).not.toThrow(InvalidDescriptionError);
      });

      it("Then create() should throw InvalidDescriptionError for comparison", () => {
        expect(() =>
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date("2024-06-25T10:00:00"),
            description: "",
            id: "txn-022",
            recipientId: "recipient-1",
            status: TransferStatus.pending(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        ).toThrow(InvalidDescriptionError);
      });
    });
  });
});
