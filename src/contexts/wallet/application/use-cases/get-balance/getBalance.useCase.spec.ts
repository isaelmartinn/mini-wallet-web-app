import { beforeEach, describe, expect, it, vi } from "vitest";

import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";
import { BalanceAmount } from "#wallet/domain/value-objects";

import { GetBalanceUseCase } from "./getBalance.useCase";

const createMockWalletRepository = (
  overrides?: Partial<WalletRepository>
): WalletRepository => ({
  getBalance: vi.fn(),
  getUserProfile: vi.fn(),
  updateBalance: vi.fn(),
  ...overrides,
});

describe("GetBalanceUseCase", () => {
  let mockRepository: WalletRepository;
  let useCase: GetBalanceUseCase;

  beforeEach(() => {
    mockRepository = createMockWalletRepository();
    useCase = new GetBalanceUseCase(mockRepository);
  });

  describe("Given a valid user ID", () => {
    describe("When executing the use case", () => {
      it("Then should return the user balance", async () => {
        const mockBalance = Balance.create({
          amount: BalanceAmount.create(1000),
          currency: "MXN",
          userId: "user-1",
        });

        mockRepository.getBalance = vi.fn().mockResolvedValue(mockBalance);

        const result = await useCase.execute({ userId: "user-1" });

        expect(result).toBe(mockBalance);
        expect(mockRepository.getBalance).toHaveBeenCalledWith("user-1");
      });
    });
  });

  describe("Given repository throws an error", () => {
    describe("When executing the use case", () => {
      it("Then should propagate the error", async () => {
        mockRepository.getBalance = vi
          .fn()
          .mockRejectedValue(new Error("Database error"));

        await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
          "Database error"
        );
      });
    });
  });
});
