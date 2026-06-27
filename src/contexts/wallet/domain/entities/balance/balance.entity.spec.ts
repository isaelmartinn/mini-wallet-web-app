import { describe, expect, it } from "vitest";

import { Amount } from "#shared/domain/value-objects";

import { Balance } from "./balance.entity";

describe("Balance", () => {
  describe("Given valid balance data", () => {
    describe("When creating a Balance", () => {
      it("Then should create successfully", () => {
        const amount = Amount.create(1000);
        const balance = Balance.create({
          amount,
          currency: "MXN",
          userId: "user-1",
        });

        expect(balance.getUserId()).toBe("user-1");
        expect(balance.getAmount()).toBe(amount);
        expect(balance.getCurrency()).toBe("MXN");
      });
    });
  });

  describe("Given zero amount", () => {
    describe("When creating a Balance", () => {
      it("Then should create successfully", () => {
        const amount = Amount.create(0);
        const balance = Balance.create({
          amount,
          currency: "MXN",
          userId: "user-1",
        });

        expect(balance.getAmount().getValue()).toBe(0);
      });
    });
  });

  describe("Given different currencies", () => {
    describe("When creating Balances", () => {
      it("Then should support different currency codes", () => {
        const amount = Amount.create(100);

        const balanceMXN = Balance.create({
          amount,
          currency: "MXN",
          userId: "user-1",
        });

        const balanceUSD = Balance.create({
          amount,
          currency: "USD",
          userId: "user-1",
        });

        expect(balanceMXN.getCurrency()).toBe("MXN");
        expect(balanceUSD.getCurrency()).toBe("USD");
      });
    });
  });
});
