import { describe, expect, it } from "vitest";

import { TransferAmountMustBeGreaterThanZeroError } from "#payments/transfer/domain/errors";

import { TransferAmount } from "./transferAmount.vo";

describe("TransferAmount", () => {
  describe("Given a valid positive amount", () => {
    describe("When creating a TransferAmount", () => {
      it("Then should create successfully", () => {
        const amount = TransferAmount.create(1000);

        expect(amount.getValue()).toBe(1000);
      });

      it("Then should round to 2 decimal places", () => {
        const amount = TransferAmount.create(1000.456);

        expect(amount.getValue()).toBe(1000.46);
      });
    });
  });

  describe("Given zero amount", () => {
    describe("When creating a TransferAmount", () => {
      it("Then should throw TransferAmountMustBeGreaterThanZeroError", () => {
        expect(() => TransferAmount.create(0)).toThrow(
          TransferAmountMustBeGreaterThanZeroError
        );
      });
    });
  });

  describe("Given a negative amount", () => {
    describe("When creating a TransferAmount", () => {
      it("Then should throw TransferAmountMustBeGreaterThanZeroError", () => {
        expect(() => TransferAmount.create(-100)).toThrow(
          TransferAmountMustBeGreaterThanZeroError
        );
      });
    });
  });

  describe("Given an invalid number", () => {
    describe("When creating a TransferAmount", () => {
      it("Then should throw AmountInvalidError for NaN", () => {
        expect(() => TransferAmount.create(NaN)).toThrow();
      });

      it("Then should throw AmountInvalidError for Infinity", () => {
        expect(() => TransferAmount.create(Infinity)).toThrow();
      });
    });
  });

  describe("Given two TransferAmounts", () => {
    describe("When adding them", () => {
      it("Then should return correct sum", () => {
        const amount1 = TransferAmount.create(1000);
        const amount2 = TransferAmount.create(500);

        const result = amount1.add(amount2);

        expect(result.getValue()).toBe(1500);
      });
    });

    describe("When comparing them", () => {
      it("Then should correctly identify greater than", () => {
        const amount1 = TransferAmount.create(1000);
        const amount2 = TransferAmount.create(500);

        expect(amount1.isGreaterThan(amount2)).toBe(true);
        expect(amount2.isGreaterThan(amount1)).toBe(false);
      });

      it("Then should correctly identify greater than or equal", () => {
        const amount1 = TransferAmount.create(1000);
        const amount2 = TransferAmount.create(1000);
        const amount3 = TransferAmount.create(500);

        expect(amount1.isGreaterThanOrEqual(amount2)).toBe(true);
        expect(amount1.isGreaterThanOrEqual(amount3)).toBe(true);
        expect(amount3.isGreaterThanOrEqual(amount1)).toBe(false);
      });

      it("Then should correctly identify less than", () => {
        const amount1 = TransferAmount.create(500);
        const amount2 = TransferAmount.create(1000);

        expect(amount1.isLessThan(amount2)).toBe(true);
        expect(amount2.isLessThan(amount1)).toBe(false);
      });
    });
  });

  describe("Given a rehydration scenario", () => {
    describe("When rehydrating a TransferAmount", () => {
      it("Then should create without validation", () => {
        const amount = TransferAmount.rehydrate(1000);

        expect(amount.getValue()).toBe(1000);
      });
    });
  });
});
