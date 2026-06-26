import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

vi.mock("lucide-react", () => ({
  AlertCircle: () => null,
  ArrowDownLeft: () => null,
  ArrowUpRight: () => null,
  Clock: () => null,
  Eye: () => null,
  EyeOff: () => null,
  Send: () => null,
  User: () => null,
  XCircle: () => null,
}));

beforeAll(() => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      clear: () => {
        store = {};
      },
      getItem: (key: string) => {
        return store[key] || null;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
    };
  })();

  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: localStorageMock,
  });
});

afterEach(() => {
  cleanup();
});
