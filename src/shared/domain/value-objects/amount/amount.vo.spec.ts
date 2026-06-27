import { describe, expect, it } from "vitest";

import { AmountInvalidError, AmountNegativeError } from "#shared/domain/errors";

import { Amount } from "./amount.vo";

describe("Amount", () => {
  describe("Given a valid positive number", () => {
    describe("When creating an Amount", () => {
      it("Then should create successfully", () => {
        const amount = Amount.create(100.5);

        expect(amount.getValue()).toBe(100.5);
      });

      it("Then should round to 2 decimal places", () => {
        const amount = Amount.create(100.555);

        expect(amount.getValue()).toBe(100.56);
      });
    });
  });

  describe("Given zero", () => {
    describe("When creating an Amount", () => {
      it("Then should create successfully", () => {
        const amount = Amount.create(0);

        expect(amount.getValue()).toBe(0);
      });
    });
  });

  describe("Given a negative number", () => {
    describe("When creating an Amount", () => {
      it("Then should throw AmountNegativeError", () => {
        expect(() => Amount.create(-10)).toThrow(AmountNegativeError);
      });
    });
  });

  describe("Given an invalid value", () => {
    describe("When creating an Amount with NaN", () => {
      it("Then should throw AmountInvalidError", () => {
        expect(() => Amount.create(NaN)).toThrow(AmountInvalidError);
      });
    });

    describe("When creating an Amount with Infinity", () => {
      it("Then should throw AmountInvalidError", () => {
        expect(() => Amount.create(Infinity)).toThrow(AmountInvalidError);
      });
    });
  });

  describe("Given two Amount instances", () => {
    describe("When adding them", () => {
      it("Then should return a new Amount with the sum", () => {
        const amount1 = Amount.create(100);
        const amount2 = Amount.create(50);

        const result = amount1.add(amount2);

        expect(result.getValue()).toBe(150);
      });
    });

    describe("When subtracting them", () => {
      it("Then should return a new Amount with the difference", () => {
        const amount1 = Amount.create(100);
        const amount2 = Amount.create(30);

        const result = amount1.subtract(amount2);

        expect(result.getValue()).toBe(70);
      });

      it("Then should throw AmountNegativeError if result is negative", () => {
        const amount1 = Amount.create(50);
        const amount2 = Amount.create(100);

        expect(() => amount1.subtract(amount2)).toThrow(AmountNegativeError);
      });
    });

    describe("When comparing them", () => {
      it("Then isGreaterThan should return true if first is greater", () => {
        const amount1 = Amount.create(100);
        const amount2 = Amount.create(50);

        expect(amount1.isGreaterThan(amount2)).toBe(true);
        expect(amount2.isGreaterThan(amount1)).toBe(false);
      });

      it("Then isGreaterThanOrEqual should return true if first is greater or equal", () => {
        const amount1 = Amount.create(100);
        const amount2 = Amount.create(100);
        const amount3 = Amount.create(50);

        expect(amount1.isGreaterThanOrEqual(amount2)).toBe(true);
        expect(amount1.isGreaterThanOrEqual(amount3)).toBe(true);
        expect(amount3.isGreaterThanOrEqual(amount1)).toBe(false);
      });

      it("Then isLessThan should return true if first is less", () => {
        const amount1 = Amount.create(50);
        const amount2 = Amount.create(100);

        expect(amount1.isLessThan(amount2)).toBe(true);
        expect(amount2.isLessThan(amount1)).toBe(false);
      });
    });
  });
});
