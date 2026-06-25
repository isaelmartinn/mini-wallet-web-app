import { describe, expect, it } from "vitest";

import { LogoutUseCase } from "./logout.useCase";

describe("LogoutUseCase", () => {
  describe("Given a LogoutUseCase instance", () => {
    describe("When executing logout", () => {
      it("Then should resolve successfully", async () => {
        const logoutUseCase = new LogoutUseCase();

        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
      });

      it("Then should return void", async () => {
        const logoutUseCase = new LogoutUseCase();

        const result = await logoutUseCase.execute();

        expect(result).toBeUndefined();
      });
    });
  });

  describe("Given multiple logout executions", () => {
    describe("When executing logout multiple times", () => {
      it("Then should resolve successfully each time", async () => {
        const logoutUseCase = new LogoutUseCase();

        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
        await expect(logoutUseCase.execute()).resolves.toBeUndefined();
      });
    });
  });

  describe("Given LogoutUseCase implementation", () => {
    describe("When checking the interface", () => {
      it("Then should have execute method", () => {
        const logoutUseCase = new LogoutUseCase();

        expect(logoutUseCase).toHaveProperty("execute");
        expect(typeof logoutUseCase.execute).toBe("function");
      });
    });
  });
});
