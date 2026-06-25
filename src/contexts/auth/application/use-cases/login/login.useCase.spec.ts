import { describe, expect, it, vi } from "vitest";

import { User } from "#auth/domain/entities";
import { InvalidCredentialsError } from "#auth/domain/errors";
import { AuthRepository } from "#auth/domain/repositories";
import { Email, Phone } from "#auth/domain/value-objects";

import { LoginUseCase } from "./login.useCase";

describe("LoginUseCase", () => {
  describe("Given valid email credential", () => {
    describe("When executing login", () => {
      it("Then should return user successfully", async () => {
        const email = Email.create("test@example.com");
        const mockUser = User.create({
          email,
          id: "user-123",
          name: "John Doe",
        });

        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockResolvedValue(mockUser),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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

        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockResolvedValue(mockUser),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn(),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

        await expect(
          loginUseCase.execute({ credential: "invalid-email" })
        ).rejects.toThrow();
      });

      it("Then should throw InvalidCredentialsError for invalid phone", async () => {
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn(),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

        await expect(
          loginUseCase.execute({ credential: "123456" })
        ).rejects.toThrow();
      });

      it("Then should throw InvalidCredentialsError for empty credential", async () => {
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn(),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

        await expect(
          loginUseCase.execute({ credential: "" })
        ).rejects.toThrow();
      });

      it("Then should not call repository when credential is invalid", async () => {
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn(),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockResolvedValue(null),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow(InvalidCredentialsError);
        await expect(
          loginUseCase.execute({ credential: "test@example.com" })
        ).rejects.toThrow("User not found");
      });

      it("Then should call repository with correct credential", async () => {
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockResolvedValue(null),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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
        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockRejectedValue(repositoryError),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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

        const mockAuthRepository: AuthRepository = {
          findByCredential: vi.fn().mockResolvedValue(mockUser),
          getStoredSession: vi.fn(),
        };

        const loginUseCase = new LoginUseCase(mockAuthRepository);

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
