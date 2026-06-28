import { describe, expect, it } from "vitest";

import { BalanceCannotBeNegativeError } from "#wallet/domain/errors";

import { BalanceAmount } from "./balanceAmount.vo";

describe("BalanceAmount", () => {
  describe("Given a valid positive amount", () => {
    describe("When creating a BalanceAmount", () => {
      it("Then should create successfully", () => {
        const amount = BalanceAmount.create(1000);

        expect(amount.getValue()).toBe(1000);
      });

      it("Then should round to 2 decimal places", () => {
        const amount = BalanceAmount.create(1000.456);

        expect(amount.getValue()).toBe(1000.46);
      });
    });
  });

  describe("Given zero amount", () => {
    describe("When creating a BalanceAmount", () => {
      it("Then should create successfully (balance can be zero)", () => {
        const amount = BalanceAmount.create(0);

        expect(amount.getValue()).toBe(0);
      });
    });
  });

  describe("Given a negative amount", () => {
    describe("When creating a BalanceAmount", () => {
      it("Then should throw BalanceCannotBeNegativeError", () => {
        expect(() => BalanceAmount.create(-100)).toThrow(
          BalanceCannotBeNegativeError
        );
      });
    });
  });

  describe("Given an invalid number", () => {
    describe("When creating a BalanceAmount", () => {
      it("Then should throw AmountInvalidError for NaN", () => {
        expect(() => BalanceAmount.create(NaN)).toThrow();
      });

      it("Then should throw AmountInvalidError for Infinity", () => {
        expect(() => BalanceAmount.create(Infinity)).toThrow();
      });
    });
  });

  describe("Given two BalanceAmounts", () => {
    describe("When adding them", () => {
      it("Then should return correct sum", () => {
        const amount1 = BalanceAmount.create(1000);
        const amount2 = BalanceAmount.create(500);

        const result = amount1.add(amount2);

        expect(result.getValue()).toBe(1500);
      });
    });

    describe("When subtracting them", () => {
      it("Then should return correct difference", () => {
        const amount1 = BalanceAmount.create(1000);
        const amount2 = BalanceAmount.create(300);

        const result = amount1.subtract(amount2);

        expect(result.getValue()).toBe(700);
      });

      it("Then should throw error if result is negative", () => {
        const amount1 = BalanceAmount.create(100);
        const amount2 = BalanceAmount.create(300);

        expect(() => amount1.subtract(amount2)).toThrow(
          BalanceCannotBeNegativeError
        );
      });
    });

    describe("When comparing them", () => {
      it("Then should correctly identify greater than", () => {
        const amount1 = BalanceAmount.create(1000);
        const amount2 = BalanceAmount.create(500);

        expect(amount1.isGreaterThan(amount2)).toBe(true);
        expect(amount2.isGreaterThan(amount1)).toBe(false);
      });

      it("Then should correctly identify greater than or equal", () => {
        const amount1 = BalanceAmount.create(1000);
        const amount2 = BalanceAmount.create(1000);
        const amount3 = BalanceAmount.create(500);

        expect(amount1.isGreaterThanOrEqual(amount2)).toBe(true);
        expect(amount1.isGreaterThanOrEqual(amount3)).toBe(true);
        expect(amount3.isGreaterThanOrEqual(amount1)).toBe(false);
      });

      it("Then should correctly identify less than", () => {
        const amount1 = BalanceAmount.create(500);
        const amount2 = BalanceAmount.create(1000);

        expect(amount1.isLessThan(amount2)).toBe(true);
        expect(amount2.isLessThan(amount1)).toBe(false);
      });
    });
  });

  describe("Given a rehydration scenario", () => {
    describe("When rehydrating a BalanceAmount", () => {
      it("Then should create without validation", () => {
        const amount = BalanceAmount.rehydrate(1000);

        expect(amount.getValue()).toBe(1000);
      });
    });
  });
});
