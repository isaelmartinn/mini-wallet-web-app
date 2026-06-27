import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocalStorageService } from "./localStorageService";

describe("LocalStorageService", () => {
  let service: LocalStorageService;

  beforeEach(() => {
    service = new LocalStorageService();
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Given a valid key and value", () => {
    describe("When setting a value", () => {
      it("Then should store the value in localStorage", () => {
        const key = "test-key";
        const value = { id: "123", name: "Test" };

        service.set(key, value);

        const stored = localStorage.getItem(key);
        expect(stored).toBe(JSON.stringify(value));
      });
    });
  });

  describe("Given a stored value", () => {
    describe("When getting the value", () => {
      it("Then should return the parsed value", () => {
        const key = "test-key";
        const value = { id: "123", name: "Test" };
        localStorage.setItem(key, JSON.stringify(value));

        const result = service.get<{ id: string; name: string }>(key);

        expect(result).toEqual(value);
      });
    });
  });

  describe("Given a non-existent key", () => {
    describe("When getting the value", () => {
      it("Then should return null", () => {
        const result = service.get("non-existent-key");

        expect(result).toBeNull();
      });
    });
  });

  describe("Given a stored value", () => {
    describe("When removing the value", () => {
      it("Then should remove it from localStorage", () => {
        const key = "test-key";
        localStorage.setItem(key, JSON.stringify({ test: "value" }));

        service.remove(key);

        expect(localStorage.getItem(key)).toBeNull();
      });
    });
  });

  describe("Given invalid JSON in localStorage", () => {
    describe("When getting the value", () => {
      it("Then should return null and log error", () => {
        const key = "test-key";
        const consoleErrorSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        localStorage.setItem(key, "invalid-json{");

        const result = service.get(key);

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });
    });
  });
});
