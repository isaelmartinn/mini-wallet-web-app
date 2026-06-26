import { describe, expect, it } from "vitest";

import { TransferStatus, TransferStatusEnum } from "./transferStatus.vo";

describe("TransferStatus", () => {
  describe("Given factory methods", () => {
    describe("When creating a pending status", () => {
      it("Then should create a PENDING status", () => {
        const status = TransferStatus.pending();

        expect(status.getValue()).toBe(TransferStatusEnum.PENDING);
        expect(status.isPending()).toBe(true);
        expect(status.isSuccess()).toBe(false);
        expect(status.isFailed()).toBe(false);
      });
    });

    describe("When creating a success status", () => {
      it("Then should create a SUCCESS status", () => {
        const status = TransferStatus.success();

        expect(status.getValue()).toBe(TransferStatusEnum.SUCCESS);
        expect(status.isPending()).toBe(false);
        expect(status.isSuccess()).toBe(true);
        expect(status.isFailed()).toBe(false);
      });
    });

    describe("When creating a failed status", () => {
      it("Then should create a FAILED status", () => {
        const status = TransferStatus.failed();

        expect(status.getValue()).toBe(TransferStatusEnum.FAILED);
        expect(status.isPending()).toBe(false);
        expect(status.isSuccess()).toBe(false);
        expect(status.isFailed()).toBe(true);
      });
    });
  });

  describe("Given two TransferStatus instances", () => {
    describe("When comparing equal statuses", () => {
      it("Then should return true", () => {
        const status1 = TransferStatus.success();
        const status2 = TransferStatus.success();

        expect(status1.equals(status2)).toBe(true);
      });
    });

    describe("When comparing different statuses", () => {
      it("Then should return false", () => {
        const status1 = TransferStatus.success();
        const status2 = TransferStatus.failed();

        expect(status1.equals(status2)).toBe(false);
      });
    });
  });
});
