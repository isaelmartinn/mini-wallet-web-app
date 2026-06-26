import { describe, expect, it } from "vitest";

import {
  TransactionType,
  TransactionTypeEnum,
} from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

describe("TransactionType", () => {
  describe("Given factory methods", () => {
    describe("When creating an expense type", () => {
      it("Then should create an EXPENSE type", () => {
        const type = TransactionType.expense();

        expect(type.getValue()).toBe(TransactionTypeEnum.EXPENSE);
        expect(type.isExpense()).toBe(true);
        expect(type.isIncome()).toBe(false);
      });
    });

    describe("When creating an income type", () => {
      it("Then should create an INCOME type", () => {
        const type = TransactionType.income();

        expect(type.getValue()).toBe(TransactionTypeEnum.INCOME);
        expect(type.isExpense()).toBe(false);
        expect(type.isIncome()).toBe(true);
      });
    });
  });

  describe("Given two TransactionType instances", () => {
    describe("When comparing equal types", () => {
      it("Then should return true", () => {
        const type1 = TransactionType.expense();
        const type2 = TransactionType.expense();

        expect(type1.equals(type2)).toBe(true);
      });
    });

    describe("When comparing different types", () => {
      it("Then should return false", () => {
        const type1 = TransactionType.expense();
        const type2 = TransactionType.income();

        expect(type1.equals(type2)).toBe(false);
      });
    });
  });
});
