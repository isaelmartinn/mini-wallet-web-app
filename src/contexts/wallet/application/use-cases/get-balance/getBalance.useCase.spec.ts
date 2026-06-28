import { describe, expect, it, vi } from "vitest";

import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";
import { BalanceAmount } from "#wallet/domain/value-objects";

import { GetBalanceUseCase } from "./getBalance.useCase";

describe("GetBalanceUseCase", () => {
  describe("Given a valid user ID", () => {
    describe("When executing the use case", () => {
      it("Then should return the user balance", async () => {
        const mockBalance = Balance.create({
          amount: BalanceAmount.create(1000),
          currency: "MXN",
          userId: "user-1",
        });

        const mockRepository: WalletRepository = {
          getBalance: vi.fn().mockResolvedValue(mockBalance),
          getUserProfile: vi.fn(),
          updateBalance: function (
            _userId: string,
            _newBalance: Balance
          ): Promise<void> {
            throw new Error("Function not implemented.");
          },
        };

        const useCase = new GetBalanceUseCase(mockRepository);
        const result = await useCase.execute({ userId: "user-1" });

        expect(result).toBe(mockBalance);
        expect(mockRepository.getBalance).toHaveBeenCalledWith("user-1");
      });
    });
  });

  describe("Given repository throws an error", () => {
    describe("When executing the use case", () => {
      it("Then should propagate the error", async () => {
        const mockRepository: WalletRepository = {
          getBalance: vi.fn().mockRejectedValue(new Error("Database error")),
          getUserProfile: vi.fn(),
          updateBalance: function (
            _userId: string,
            _newBalance: Balance
          ): Promise<void> {
            throw new Error("Function not implemented.");
          },
        };

        const useCase = new GetBalanceUseCase(mockRepository);

        await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
          "Database error"
        );
      });
    });
  });
});
