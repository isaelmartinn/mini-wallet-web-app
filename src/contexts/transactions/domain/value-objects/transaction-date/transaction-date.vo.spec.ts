import { describe, expect, it } from "vitest";

import { TransactionDateInvalidError } from "#transactions/domain/errors/transaction-date-invalid.error";
import { TransactionDate } from "#transactions/domain/value-objects/transaction-date/transaction-date.vo";

describe("TransactionDate", () => {
  describe("Given a valid date", () => {
    describe("When creating from Date object", () => {
      it("Then should create TransactionDate successfully", () => {
        const date = new Date("2024-06-25T10:00:00");
        const transactionDate = TransactionDate.create(date);

        expect(transactionDate.getValue()).toEqual(date);
      });
    });

    describe("When creating from ISO string", () => {
      it("Then should create TransactionDate successfully", () => {
        const isoString = "2024-06-25T10:00:00.000Z";
        const transactionDate = TransactionDate.create(isoString);

        expect(transactionDate.toISOString()).toBe(isoString);
      });
    });

    describe("When creating with now factory", () => {
      it("Then should create TransactionDate with current date", () => {
        const before = new Date();
        const transactionDate = TransactionDate.now();
        const after = new Date();

        const dateValue = transactionDate.getValue();
        expect(dateValue.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(dateValue.getTime()).toBeLessThanOrEqual(after.getTime());
      });
    });
  });

  describe("Given an invalid date", () => {
    describe("When creating from invalid string", () => {
      it("Then should throw TransactionDateInvalidError", () => {
        expect(() => TransactionDate.create("invalid-date")).toThrow(
          TransactionDateInvalidError
        );
      });
    });
  });

  describe("Given two TransactionDate instances", () => {
    describe("When comparing dates", () => {
      it("Then should correctly identify before relationship", () => {
        const earlier = TransactionDate.create(new Date("2024-06-24"));
        const later = TransactionDate.create(new Date("2024-06-25"));

        expect(earlier.isBefore(later)).toBe(true);
        expect(later.isBefore(earlier)).toBe(false);
      });

      it("Then should correctly identify after relationship", () => {
        const earlier = TransactionDate.create(new Date("2024-06-24"));
        const later = TransactionDate.create(new Date("2024-06-25"));

        expect(later.isAfter(earlier)).toBe(true);
        expect(earlier.isAfter(later)).toBe(false);
      });

      it("Then should correctly identify equality", () => {
        const date1 = TransactionDate.create(new Date("2024-06-25T10:00:00"));
        const date2 = TransactionDate.create(new Date("2024-06-25T10:00:00"));

        expect(date1.equals(date2)).toBe(true);
      });

      it("Then should correctly identify inequality", () => {
        const date1 = TransactionDate.create(new Date("2024-06-25T10:00:00"));
        const date2 = TransactionDate.create(new Date("2024-06-25T11:00:00"));

        expect(date1.equals(date2)).toBe(false);
      });
    });
  });
});
