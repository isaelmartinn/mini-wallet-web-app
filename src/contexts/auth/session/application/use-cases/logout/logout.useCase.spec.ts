import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthRepository } from "#auth/session/domain/repositories";

import { LogoutUseCase } from "./logout.useCase";

describe("LogoutUseCase", () => {
  let mockAuthRepository: AuthRepository;
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      clearSession: vi.fn().mockResolvedValue(undefined),
      findByCredential: vi.fn(),
      getStoredSession: vi.fn(),
    };

    logoutUseCase = new LogoutUseCase(mockAuthRepository);
  });

  describe("Given a LogoutUseCase instance", () => {
    describe("When executing logout", () => {
      it("Then should call repository clearSession", async () => {
        await logoutUseCase.execute();

        expect(mockAuthRepository.clearSession).toHaveBeenCalledTimes(1);
      });

      it("Then should resolve successfully", async () => {
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
      });

      it("Then should return void", async () => {
        const result = await logoutUseCase.execute();

        expect(result).toBeUndefined();
      });
    });
  });

  describe("Given multiple logout executions", () => {
    describe("When executing logout multiple times", () => {
      it("Then should call repository clearSession each time", async () => {
        await logoutUseCase.execute();
        await logoutUseCase.execute();
        await logoutUseCase.execute();

        expect(mockAuthRepository.clearSession).toHaveBeenCalledTimes(3);
      });

      it("Then should resolve successfully each time", async () => {
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
      });
    });
  });

  describe("Given LogoutUseCase implementation", () => {
    describe("When checking the interface", () => {
      it("Then should have execute method", () => {
        expect(logoutUseCase).toHaveProperty("execute");
        expect(typeof logoutUseCase.execute).toBe("function");
      });
    });
  });
});
