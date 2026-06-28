import { beforeEach, describe, expect, it, vi } from "vitest";

import { User } from "#auth/session/domain/entities";
import { InvalidCredentialsError } from "#auth/session/domain/errors";
import { AuthRepository } from "#auth/session/domain/repositories";
import { Email, Phone } from "#shared/domain/value-objects";

import { LoginUseCase } from "./login.useCase";

const createMockAuthRepository = (
  overrides?: Partial<AuthRepository>
): AuthRepository => ({
  clearSession: vi.fn(),
  findByCredential: vi.fn(),
  getStoredSession: vi.fn(),
  ...overrides,
});

describe("LoginUseCase", () => {
  let mockAuthRepository: AuthRepository;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    mockAuthRepository = createMockAuthRepository();
    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  describe("Given valid email credential", () => {
    describe("When executing login", () => {
      it("Then should return user successfully", async () => {
        const email = Email.create("test@example.com");
        const mockUser = User.create({
          email,
          id: "user-123",
          name: "John Doe",
        });

        mockAuthRepository.findByCredential = vi
          .fn()
          .mockResolvedValue(mockUser);

        const result = await loginUseCase.execute({
          credential: "test@example.com",
        });

        expect(result).toBe(mockUser);
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledWith(
          expect.any(Email)
        );
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given valid phone credential", () => {
    describe("When executing login", () => {
      it("Then should return user successfully", async () => {
        const phone = Phone.create("+525512345678");
        const mockUser = User.create({
          id: "user-456",
          name: "Jane Doe",
          phone,
        });

        mockAuthRepository.findByCredential = vi
          .fn()
          .mockResolvedValue(mockUser);

        const result = await loginUseCase.execute({
          credential: "+525512345678",
        });

        expect(result).toBe(mockUser);
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledWith(
          expect.any(Phone)
        );
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given invalid credential format", () => {
    describe("When executing login", () => {
      it("Then should throw InvalidCredentialsError for invalid email", async () => {
        await expect(
          loginUseCase.execute({ credential: "invalid-email" })
        ).rejects.toThrow();
      });

      it("Then should throw InvalidCredentialsError for invalid phone", async () => {
        await expect(
          loginUseCase.execute({ credential: "123456" })
        ).rejects.toThrow();
      });

      it("Then should throw InvalidCredentialsError for empty credential", async () => {
        await expect(
          loginUseCase.execute({ credential: "" })
        ).rejects.toThrow();
      });

      it("Then should not call repository when credential is invalid", async () => {
        await expect(
          loginUseCase.execute({ credential: "invalid" })
        ).rejects.toThrow();

        expect(mockAuthRepository.findByCredential).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given valid credential but user not found", () => {
    describe("When executing login", () => {
      it("Then should throw InvalidCredentialsError", async () => {
        mockAuthRepository.findByCredential = vi.fn().mockResolvedValue(null);

        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow(InvalidCredentialsError);
        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow("Invalid credentials");
      });

      it("Then should call repository with correct credential", async () => {
        mockAuthRepository.findByCredential = vi.fn().mockResolvedValue(null);

        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow();

        expect(mockAuthRepository.findByCredential).toHaveBeenCalledWith(
          expect.any(Email)
        );
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given repository throws error", () => {
    describe("When executing login", () => {
      it("Then should propagate the error", async () => {
        const repositoryError = new Error("Database connection failed");
        mockAuthRepository.findByCredential = vi
          .fn()
          .mockRejectedValue(repositoryError);

        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow("Database connection failed");
      });
    });
  });

  describe("Given mixed case email credential", () => {
    describe("When executing login", () => {
      it("Then should process credential correctly", async () => {
        const email = Email.create("Test@Example.COM");
        const mockUser = User.create({
          email,
          id: "user-789",
          name: "Test User",
        });

        mockAuthRepository.findByCredential = vi
          .fn()
          .mockResolvedValue(mockUser);

        const result = await loginUseCase.execute({
          credential: "Test@Example.COM",
        });

        expect(result).toBe(mockUser);
        expect(mockAuthRepository.findByCredential).toHaveBeenCalledWith(
          expect.any(Email)
        );
      });
    });
  });
});
