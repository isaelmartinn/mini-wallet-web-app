import { describe, expect, it } from "vitest";

import {
  TransactionStatus,
  TransactionStatusEnum,
} from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";

describe("TransactionStatus", () => {
  describe("Given factory methods", () => {
    describe("When creating a pending status", () => {
      it("Then should create a PENDING status", () => {
        const status = TransactionStatus.pending();

        expect(status.getValue()).toBe(TransactionStatusEnum.PENDING);
        expect(status.isPending()).toBe(true);
        expect(status.isSuccess()).toBe(false);
        expect(status.isFailed()).toBe(false);
      });
    });

    describe("When creating a success status", () => {
      it("Then should create a SUCCESS status", () => {
        const status = TransactionStatus.success();

        expect(status.getValue()).toBe(TransactionStatusEnum.SUCCESS);
        expect(status.isPending()).toBe(false);
        expect(status.isSuccess()).toBe(true);
        expect(status.isFailed()).toBe(false);
      });
    });

    describe("When creating a failed status", () => {
      it("Then should create a FAILED status", () => {
        const status = TransactionStatus.failed();

        expect(status.getValue()).toBe(TransactionStatusEnum.FAILED);
        expect(status.isPending()).toBe(false);
        expect(status.isSuccess()).toBe(false);
        expect(status.isFailed()).toBe(true);
      });
    });
  });

  describe("Given two TransactionStatus instances", () => {
    describe("When comparing equal statuses", () => {
      it("Then should return true", () => {
        const status1 = TransactionStatus.success();
        const status2 = TransactionStatus.success();

        expect(status1.equals(status2)).toBe(true);
      });
    });

    describe("When comparing different statuses", () => {
      it("Then should return false", () => {
        const status1 = TransactionStatus.success();
        const status2 = TransactionStatus.failed();

        expect(status1.equals(status2)).toBe(false);
      });
    });
  });
});
