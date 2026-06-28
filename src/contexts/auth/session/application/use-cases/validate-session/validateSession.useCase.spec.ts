import { beforeEach, describe, expect, it, vi } from "vitest";

import { User } from "#auth/session/domain/entities";
import { AuthRepository } from "#auth/session/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { ValidateSessionUseCase } from "./validateSession.useCase";

describe("ValidateSessionUseCase", () => {
  let mockAuthRepository: AuthRepository;
  let validateSessionUseCase: ValidateSessionUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      findByCredential: vi.fn(),
      getStoredSession: vi.fn(),
    } as unknown as AuthRepository;

    validateSessionUseCase = new ValidateSessionUseCase(mockAuthRepository);
  });

  describe("Given repository returns a valid user", () => {
    describe("When executing validate session", () => {
      it("Then should return the user from repository", async () => {
        const mockUser = User.create({
          email: Email.create("test@example.com"),
          id: "user-123",
          name: "John Doe",
          phone: Phone.create("+525512345678"),
        });

        vi.mocked(mockAuthRepository.getStoredSession).mockResolvedValue(
          mockUser
        );

        const result = await validateSessionUseCase.execute();

        expect(mockAuthRepository.getStoredSession).toHaveBeenCalledOnce();
        expect(result).toBe(mockUser);
        expect(result?.getId()).toBe("user-123");
        expect(result?.getName()).toBe("John Doe");
      });
    });
  });

  describe("Given repository returns null", () => {
    describe("When executing validate session", () => {
      it("Then should return null", async () => {
        vi.mocked(mockAuthRepository.getStoredSession).mockResolvedValue(null);

        const result = await validateSessionUseCase.execute();

        expect(mockAuthRepository.getStoredSession).toHaveBeenCalledOnce();
        expect(result).toBeNull();
      });
    });
  });

  describe("Given repository throws an error", () => {
    describe("When executing validate session", () => {
      it("Then should propagate the error", async () => {
        const error = new Error("Repository error");
        vi.mocked(mockAuthRepository.getStoredSession).mockRejectedValue(error);

        await expect(validateSessionUseCase.execute()).rejects.toThrow(
          "Repository error"
        );
        expect(mockAuthRepository.getStoredSession).toHaveBeenCalledOnce();
      });
    });
  });
});
