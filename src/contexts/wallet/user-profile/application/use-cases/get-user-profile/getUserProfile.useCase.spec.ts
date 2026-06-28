import { describe, expect, it, vi } from "vitest";

import { WalletRepository } from "#wallet/balance/domain/repositories";
import { UserProfile } from "#wallet/user-profile/domain/entities";

import { GetUserProfileUseCase } from "./getUserProfile.useCase";

const createMockWalletRepository = (
  overrides?: Partial<WalletRepository>
): WalletRepository => ({
  getBalance: vi.fn(),
  getUserProfile: vi.fn(),
  updateBalance: vi.fn(),
  ...overrides,
});

describe("GetUserProfileUseCase", () => {
  describe("Given a valid user ID", () => {
    describe("When executing the use case", () => {
      it("Then should return the user profile", async () => {
        const mockProfile = UserProfile.create({
          fullName: "Juan Pérez García",
          userId: "user-1",
        });

        const mockRepository = createMockWalletRepository({
          getUserProfile: vi.fn().mockResolvedValue(mockProfile),
        });

        const useCase = new GetUserProfileUseCase(mockRepository);
        const result = await useCase.execute({ userId: "user-1" });

        expect(result).toBe(mockProfile);
        expect(mockRepository.getUserProfile).toHaveBeenCalledWith("user-1");
      });
    });
  });

  describe("Given repository throws an error", () => {
    describe("When executing the use case", () => {
      it("Then should propagate the error", async () => {
        const mockRepository = createMockWalletRepository({
          getUserProfile: vi
            .fn()
            .mockRejectedValue(new Error("Database error")),
        });

        const useCase = new GetUserProfileUseCase(mockRepository);

        await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
          "Database error"
        );
      });
    });
  });
});
