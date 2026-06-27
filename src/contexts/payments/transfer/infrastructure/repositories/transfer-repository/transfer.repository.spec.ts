import { beforeEach, describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain";
import { TransferFetchFailedError } from "#payments/transfer/domain/errors";

import { TransferRepositoryImpl } from "./transfer.repository";

describe("TransferRepositoryImpl", () => {
  let repository: TransferRepositoryImpl;

  beforeEach(() => {
    repository = new TransferRepositoryImpl();
  });

  describe("findByUserId", () => {
    describe("Given user-1 with 3 transfers", () => {
      describe("When fetching transfers for user-1", () => {
        it("Then should eventually return array of 3 transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-1");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toBeInstanceOf(Array);
          expect(result).toHaveLength(3);
          expect(result![0]).toBeInstanceOf(Transfer);
        });

        it("Then should return only user-1 transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-1");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          result!.forEach((transfer) => {
            expect(transfer.getUserId()).toBe("user-1");
          });
        });

        it("Then should return transfers with correct properties", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-1");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          const firstTransfer = result![0];
          expect(firstTransfer.getId()).toBe("txn-001");
          expect(firstTransfer.getAmount().getValue()).toBe(1500.0);
          expect(firstTransfer.getDescription()).toBe(
            "Transferencia a María García"
          );
          expect(firstTransfer.getType().getValue()).toBe("EXPENSE");
          expect(firstTransfer.getStatus().getValue()).toBe("SUCCESS");
        });

        it("Then should return a new array instance each time", async () => {
          let result1: null | Transfer[] = null;
          let result2: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 20;

          while (attempts < maxAttempts && (!result1 || !result2)) {
            try {
              if (!result1) {
                result1 = await repository.findByUserId("user-1");
              } else if (!result2) {
                result2 = await repository.findByUserId("user-1");
              }
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result1).not.toBeNull();
          expect(result2).not.toBeNull();
          expect(result1).not.toBe(result2);
          expect(result1).toEqual(result2);
        });

        it("Then should not mutate original fixtures", async () => {
          let result1: null | Transfer[] = null;
          let result2: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 20;

          while (attempts < maxAttempts && (!result1 || !result2)) {
            try {
              if (!result1) {
                result1 = await repository.findByUserId("user-1");
              } else if (!result2) {
                result2 = await repository.findByUserId("user-1");
              }
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result1).not.toBeNull();
          expect(result2).not.toBeNull();

          const originalLength = result1!.length;
          result1!.pop();

          expect(result2).toHaveLength(originalLength);
        });
      });
    });

    describe("Given user-2 with 3 transfers", () => {
      describe("When fetching transfers for user-2", () => {
        it("Then should return array of 3 transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-2");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toHaveLength(3);
        });
      });
    });

    describe("Given user-3 with 2 transfers", () => {
      describe("When fetching transfers for user-3", () => {
        it("Then should return array of 2 transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-3");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toHaveLength(2);
        });
      });
    });

    describe("Given non-existent user", () => {
      describe("When fetching transfers for user-999", () => {
        it("Then should return empty array", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findByUserId("user-999");
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toHaveLength(0);
        });
      });
    });

    describe("Given error simulation", () => {
      describe("When repository may fail randomly", () => {
        it("Then should throw TransferFetchFailedError on failure", async () => {
          const results = await Promise.allSettled([
            repository.findByUserId("user-1"),
            repository.findByUserId("user-1"),
            repository.findByUserId("user-1"),
            repository.findByUserId("user-1"),
            repository.findByUserId("user-1"),
          ]);

          const failures = results.filter((r) => r.status === "rejected");

          if (failures.length > 0) {
            const firstFailure = failures[0] as PromiseRejectedResult;
            expect(firstFailure.reason).toBeInstanceOf(
              TransferFetchFailedError
            );
            expect(firstFailure.reason.message).toBe(
              "Failed to fetch transfers from repository"
            );
            expect(firstFailure.reason.code).toBe("TRANSACTION_FETCH_FAILED");
          }

          expect(results.length).toBe(5);
        });
      });
    });
  });

  describe("findById", () => {
    describe("Given existing transfer txn-001", () => {
      describe("When finding transfer by ID", () => {
        it("Then should return the transfer", async () => {
          const result = await repository.findById("txn-001");

          expect(result).not.toBeNull();
          expect(result!.getId()).toBe("txn-001");
          expect(result!.getUserId()).toBe("user-1");
        });
      });
    });

    describe("Given existing transfer from different user", () => {
      describe("When finding transfer txn-004 from user-2", () => {
        it("Then should return the transfer", async () => {
          const result = await repository.findById("txn-004");

          expect(result).not.toBeNull();
          expect(result!.getId()).toBe("txn-004");
          expect(result!.getUserId()).toBe("user-2");
        });
      });
    });

    describe("Given non-existent transfer", () => {
      describe("When finding transfer by non-existent ID", () => {
        it("Then should return null", async () => {
          const result = await repository.findById("non-existent-id");

          expect(result).toBeNull();
        });
      });
    });
  });
});
