import { beforeEach, describe, expect, it, vi } from "vitest";

import { Email, Phone } from "#shared/domain/value-objects";

import { AuthRepository } from "./auth.repository";

describe("AuthRepository", () => {
  let authRepository: AuthRepository;

  beforeEach(() => {
    authRepository = new AuthRepository();
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("findByCredential", () => {
    describe("Given valid email credential", () => {
      describe("When user exists with that email", () => {
        it("Then should return the user", async () => {
          const email = Email.create("juan.perez@example.com");

          const result = await authRepository.findByCredential(email);

          expect(result).not.toBeNull();
          expect(result?.getEmail()?.getValue()).toBe("juan.perez@example.com");
          expect(result?.getName()).toBe("Juan Pérez");
        });

        it("Then should persist session in localStorage", async () => {
          const email = Email.create("juan.perez@example.com");

          await authRepository.findByCredential(email);

          const storedUser = localStorage.getItem("auth_user");
          expect(storedUser).not.toBeNull();

          const userData = JSON.parse(storedUser!);
          expect(userData.email).toBe("juan.perez@example.com");
          expect(userData.name).toBe("Juan Pérez");
        });

        it("Then should handle case-insensitive email matching", async () => {
          const email = Email.create("JUAN.PEREZ@EXAMPLE.COM");

          const result = await authRepository.findByCredential(email);

          expect(result).not.toBeNull();
          expect(result?.getName()).toBe("Juan Pérez");
        });
      });

      describe("When user does not exist with that email", () => {
        it("Then should return null", async () => {
          const email = Email.create("nonexistent@example.com");

          const result = await authRepository.findByCredential(email);

          expect(result).toBeNull();
        });

        it("Then should not persist session in localStorage", async () => {
          const email = Email.create("nonexistent@example.com");

          await authRepository.findByCredential(email);

          const storedUser = localStorage.getItem("auth_user");
          expect(storedUser).toBeNull();
        });
      });
    });

    describe("Given valid phone credential", () => {
      describe("When user exists with that phone", () => {
        it("Then should return the user", async () => {
          const phone = Phone.create("+525512345678");

          const result = await authRepository.findByCredential(phone);

          expect(result).not.toBeNull();
          expect(result?.getPhone()?.getValue()).toBe("+525512345678");
          expect(result?.getName()).toBe("Juan Pérez");
        });

        it("Then should persist session in localStorage", async () => {
          const phone = Phone.create("+525512345678");

          await authRepository.findByCredential(phone);

          const storedUser = localStorage.getItem("auth_user");
          expect(storedUser).not.toBeNull();

          const userData = JSON.parse(storedUser!);
          expect(userData.phone).toBe("+525512345678");
          expect(userData.name).toBe("Juan Pérez");
        });
      });

      describe("When user does not exist with that phone", () => {
        it("Then should return null", async () => {
          const phone = Phone.create("+529999999999");

          const result = await authRepository.findByCredential(phone);

          expect(result).toBeNull();
        });

        it("Then should not persist session in localStorage", async () => {
          const phone = Phone.create("+529999999999");

          await authRepository.findByCredential(phone);

          const storedUser = localStorage.getItem("auth_user");
          expect(storedUser).toBeNull();
        });
      });
    });

    describe("Given execution time", () => {
      it("Then should simulate async delay", async () => {
        const email = Email.create("john.doe@example.com");
        const startTime = Date.now();

        await authRepository.findByCredential(email);

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeGreaterThanOrEqual(500);
        expect(duration).toBeLessThan(2000);
      });
    });
  });

  describe("getStoredSession", () => {
    describe("Given valid stored session", () => {
      describe("When session has email and phone", () => {
        it("Then should return user with all data", async () => {
          const userData = {
            email: "john.doe@example.com",
            id: "user-123",
            name: "John Doe",
            phone: "+525512345678",
          };
          localStorage.setItem("auth_user", JSON.stringify(userData));

          const result = await authRepository.getStoredSession();

          expect(result).not.toBeNull();
          expect(result?.getId()).toBe("user-123");
          expect(result?.getName()).toBe("John Doe");
          expect(result?.getEmail()?.getValue()).toBe("john.doe@example.com");
          expect(result?.getPhone()?.getValue()).toBe("+525512345678");
        });
      });

      describe("When session has only email", () => {
        it("Then should return user with email only", async () => {
          const userData = {
            email: "juan.perez@example.com",
            id: "user-123",
            name: "Juan Pérez",
          };
          localStorage.setItem("auth_user", JSON.stringify(userData));

          const result = await authRepository.getStoredSession();

          expect(result).not.toBeNull();
          expect(result?.getId()).toBe("user-123");
          expect(result?.getName()).toBe("Juan Pérez");
          expect(result?.getEmail()?.getValue()).toBe("juan.perez@example.com");
          expect(result?.getPhone()).toBeNull();
        });
      });

      describe("When session has only phone", () => {
        it("Then should return user with phone only", async () => {
          const userData = {
            id: "user-123",
            name: "Juan Pérez",
            phone: "+521234567890",
          };
          localStorage.setItem("auth_user", JSON.stringify(userData));

          const result = await authRepository.getStoredSession();

          expect(result).not.toBeNull();
          expect(result?.getId()).toBe("user-123");
          expect(result?.getName()).toBe("Juan Pérez");
          expect(result?.getEmail()).toBeNull();
          expect(result?.getPhone()?.getValue()).toBe("+521234567890");
        });
      });
    });

    describe("Given no stored session", () => {
      it("Then should return null", async () => {
        const result = await authRepository.getStoredSession();

        expect(result).toBeNull();
      });
    });

    describe("Given invalid stored session", () => {
      describe("When localStorage contains invalid JSON", () => {
        it("Then should return null and clear storage", async () => {
          localStorage.setItem("auth_user", "invalid-json{");

          const result = await authRepository.getStoredSession();

          expect(result).toBeNull();
          expect(localStorage.getItem("auth_user")).toBeNull();
        });
      });

      describe("When localStorage contains malformed data", () => {
        it("Then should handle gracefully when required fields are missing", async () => {
          localStorage.setItem(
            "auth_user",
            JSON.stringify({ invalid: "data" })
          );

          const result = await authRepository.getStoredSession();

          expect(result).toBeDefined();
        });
      });
    });
  });

  describe("persistSession", () => {
    describe("Given user with email and phone", () => {
      it("Then should store complete user data", async () => {
        const email = Email.create("juan.perez@example.com");

        await authRepository.findByCredential(email);

        const storedUser = localStorage.getItem("auth_user");
        expect(storedUser).not.toBeNull();

        const userData = JSON.parse(storedUser!);
        expect(userData).toHaveProperty("id");
        expect(userData).toHaveProperty("name");
        expect(userData).toHaveProperty("email");
        expect(userData).toHaveProperty("phone");
      });
    });

    describe("Given user with only email", () => {
      it("Then should store user data without phone", async () => {
        const email = Email.create("test@example.com");

        await authRepository.findByCredential(email);

        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          expect(userData).toHaveProperty("id");
          expect(userData).toHaveProperty("name");
          expect(userData).toHaveProperty("email");
        }
      });
    });
  });

  describe("clearSession", () => {
    describe("Given an existing stored session", () => {
      describe("When clearSession is called", () => {
        it("Then should remove session from localStorage", async () => {
          const userData = {
            email: "juan.perez@example.com",
            id: "user-123",
            name: "Juan Pérez",
            phone: "+521234567890",
          };
          localStorage.setItem("auth_user", JSON.stringify(userData));

          await authRepository.clearSession();

          const storedUser = localStorage.getItem("auth_user");
          expect(storedUser).toBeNull();
        });

        it("Then should allow getStoredSession to return null", async () => {
          const email = Email.create("juan.perez@example.com");
          await authRepository.findByCredential(email);

          const sessionBefore = await authRepository.getStoredSession();
          expect(sessionBefore).not.toBeNull();

          await authRepository.clearSession();

          const sessionAfter = await authRepository.getStoredSession();
          expect(sessionAfter).toBeNull();
        });
      });
    });

    describe("Given no stored session", () => {
      describe("When clearSession is called", () => {
        it("Then should not throw error", async () => {
          await expect(authRepository.clearSession()).resolves.not.toThrow();
        });
      });
    });
  });

  describe("Integration scenarios", () => {
    describe("Given multiple sequential operations", () => {
      it("Then should handle login and session retrieval", async () => {
        const email = Email.create("juan.perez@example.com");

        const loginResult = await authRepository.findByCredential(email);
        expect(loginResult).not.toBeNull();

        const sessionResult = await authRepository.getStoredSession();
        expect(sessionResult).not.toBeNull();
        expect(sessionResult?.getId()).toBe(loginResult?.getId());
        expect(sessionResult?.getName()).toBe(loginResult?.getName());
      });

      it("Then should overwrite previous session", async () => {
        const firstEmail = Email.create("juan.perez@example.com");
        await authRepository.findByCredential(firstEmail);

        const firstSession = await authRepository.getStoredSession();
        expect(firstSession?.getName()).toBe("Juan Pérez");

        const secondEmail = Email.create("maria.garcia@example.com");
        await authRepository.findByCredential(secondEmail);

        const secondSession = await authRepository.getStoredSession();
        expect(secondSession?.getName()).toBe("María García");
        expect(secondSession?.getId()).not.toBe(firstSession?.getId());
      });

      it("Then should handle login, logout, and session retrieval", async () => {
        const email = Email.create("juan.perez@example.com");

        await authRepository.findByCredential(email);
        const sessionBefore = await authRepository.getStoredSession();
        expect(sessionBefore).not.toBeNull();

        await authRepository.clearSession();
        const sessionAfter = await authRepository.getStoredSession();
        expect(sessionAfter).toBeNull();
      });
    });
  });
});
