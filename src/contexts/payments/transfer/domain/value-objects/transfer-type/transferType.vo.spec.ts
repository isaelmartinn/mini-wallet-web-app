import { describe, expect, it } from "vitest";

import { TransferType, TransferTypeEnum } from "./transferType.vo";

describe("TransferType", () => {
  describe("Given factory methods", () => {
    describe("When creating an expense type", () => {
      it("Then should create an EXPENSE type", () => {
        const type = TransferType.expense();

        expect(type.getValue()).toBe(TransferTypeEnum.EXPENSE);
        expect(type.isExpense()).toBe(true);
        expect(type.isIncome()).toBe(false);
      });
    });

    describe("When creating an income type", () => {
      it("Then should create an INCOME type", () => {
        const type = TransferType.income();

        expect(type.getValue()).toBe(TransferTypeEnum.INCOME);
        expect(type.isExpense()).toBe(false);
        expect(type.isIncome()).toBe(true);
      });
    });
  });

  describe("Given two TransferType instances", () => {
    describe("When comparing equal types", () => {
      it("Then should return true", () => {
        const type1 = TransferType.expense();
        const type2 = TransferType.expense();

        expect(type1.equals(type2)).toBe(true);
      });
    });

    describe("When comparing different types", () => {
      it("Then should return false", () => {
        const type1 = TransferType.expense();
        const type2 = TransferType.income();

        expect(type1.equals(type2)).toBe(false);
      });
    });
  });
});
