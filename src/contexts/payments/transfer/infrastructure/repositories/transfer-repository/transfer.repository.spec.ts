import { beforeEach, describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain";
import { TransferFetchFailedError } from "#payments/transfer/domain/errors";

import { TransferRepositoryImpl } from "./transfer.repository";

describe("TransferRepositoryImpl", () => {
  let repository: TransferRepositoryImpl;

  beforeEach(() => {
    repository = new TransferRepositoryImpl();
  });

  describe("findAll", () => {
    describe("Given successful scenario", () => {
      describe("When fetching all transfers", () => {
        it("Then should eventually return array of transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toBeInstanceOf(Array);
          expect(result!.length).toBeGreaterThan(0);
          expect(result![0]).toBeInstanceOf(Transfer);
        });

        it("Then should return all 8 fixture transfers", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();
          expect(result).toHaveLength(8);
        });

        it("Then should return transfers with correct properties", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
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
          expect(firstTransfer.getAmount()).toBe(1500.0);
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
                result1 = await repository.findAll();
              } else if (!result2) {
                result2 = await repository.findAll();
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
                result1 = await repository.findAll();
              } else if (!result2) {
                result2 = await repository.findAll();
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

    describe("Given request with delay", () => {
      describe("When fetching transfers", () => {
        it("Then should take at least 500ms", async () => {
          const startTime = Date.now();

          try {
            await repository.findAll();
          } catch (error) {
            if (!(error instanceof TransferFetchFailedError)) {
              throw error;
            }
          }

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeGreaterThanOrEqual(500);
        });

        it("Then should take less than 2000ms", async () => {
          const startTime = Date.now();

          try {
            await repository.findAll();
          } catch (error) {
            if (!(error instanceof TransferFetchFailedError)) {
              throw error;
            }
          }

          const endTime = Date.now();
          const duration = endTime - startTime;

          expect(duration).toBeLessThan(2000);
        });
      });
    });

    describe("Given error simulation", () => {
      describe("When repository may fail randomly", () => {
        it("Then should throw TransferFetchFailedError on failure", async () => {
          const results = await Promise.allSettled([
            repository.findAll(),
            repository.findAll(),
            repository.findAll(),
            repository.findAll(),
            repository.findAll(),
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

    describe("Given transfer data integrity", () => {
      describe("When fetching transfers", () => {
        it("Then should return transfers with valid dates", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          result!.forEach((transfer) => {
            const transferDate = transfer.getDate();
            expect(transferDate.getValue()).toBeInstanceOf(Date);
            expect(transferDate.getValue().getTime()).not.toBeNaN();
          });
        });

        it("Then should return transfers with positive amounts", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          result!.forEach((transfer) => {
            expect(transfer.getAmount()).toBeGreaterThan(0);
          });
        });

        it("Then should return transfers with unique IDs", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          const ids = result!.map((t) => t.getId());
          const uniqueIds = new Set(ids);

          expect(uniqueIds.size).toBe(ids.length);
        });

        it("Then should return transfers with valid types", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          result!.forEach((transfer) => {
            const type = transfer.getType().getValue();
            expect(["INCOME", "EXPENSE"]).toContain(type);
          });
        });

        it("Then should return transfers with valid statuses", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          result!.forEach((transfer) => {
            const status = transfer.getStatus().getValue();
            expect(["SUCCESS", "PENDING", "FAILED"]).toContain(status);
          });
        });

        it("Then should return transfers with non-empty descriptions", async () => {
          let result: null | Transfer[] = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts && !result) {
            try {
              result = await repository.findAll();
            } catch (error) {
              if (!(error instanceof TransferFetchFailedError)) {
                throw error;
              }
              attempts++;
            }
          }

          expect(result).not.toBeNull();

          result!.forEach((transfer) => {
            expect(transfer.getDescription().length).toBeGreaterThan(0);
          });
        });
      });
    });
  });
});
