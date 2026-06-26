import { describe, expect, it } from "vitest";

import { TransferDateInvalidError } from "#payments/transfer/domain/errors";

import { TransferDate } from "./transferDate.vo";

describe("TransferDate", () => {
  describe("Given a valid date", () => {
    describe("When creating from Date object", () => {
      it("Then should create TransferDate successfully", () => {
        const date = new Date("2024-06-25T10:00:00");
        const transferDate = TransferDate.create(date);

        expect(transferDate.getValue()).toEqual(date);
      });
    });

    describe("When creating from ISO string", () => {
      it("Then should create TransferDate successfully", () => {
        const isoString = "2024-06-25T10:00:00.000Z";
        const transferDate = TransferDate.create(isoString);

        expect(transferDate.toISOString()).toBe(isoString);
      });
    });

    describe("When creating with now factory", () => {
      it("Then should create TransferDate with current date", () => {
        const before = new Date();
        const transferDate = TransferDate.now();
        const after = new Date();

        const dateValue = transferDate.getValue();
        expect(dateValue.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(dateValue.getTime()).toBeLessThanOrEqual(after.getTime());
      });
    });
  });

  describe("Given an invalid date", () => {
    describe("When creating from invalid string", () => {
      it("Then should throw TransferDateInvalidError", () => {
        expect(() => TransferDate.create("invalid-date")).toThrow(
          TransferDateInvalidError
        );
      });
    });
  });

  describe("Given two TransferDate instances", () => {
    describe("When comparing dates", () => {
      it("Then should correctly identify before relationship", () => {
        const earlier = TransferDate.create(new Date("2024-06-24"));
        const later = TransferDate.create(new Date("2024-06-25"));

        expect(earlier.isBefore(later)).toBe(true);
        expect(later.isBefore(earlier)).toBe(false);
      });

      it("Then should correctly identify after relationship", () => {
        const earlier = TransferDate.create(new Date("2024-06-24"));
        const later = TransferDate.create(new Date("2024-06-25"));

        expect(later.isAfter(earlier)).toBe(true);
        expect(earlier.isAfter(later)).toBe(false);
      });

      it("Then should correctly identify equality", () => {
        const date1 = TransferDate.create(new Date("2024-06-25T10:00:00"));
        const date2 = TransferDate.create(new Date("2024-06-25T10:00:00"));

        expect(date1.equals(date2)).toBe(true);
      });

      it("Then should correctly identify inequality", () => {
        const date1 = TransferDate.create(new Date("2024-06-25T10:00:00"));
        const date2 = TransferDate.create(new Date("2024-06-25T11:00:00"));

        expect(date1.equals(date2)).toBe(false);
      });
    });
  });
});
