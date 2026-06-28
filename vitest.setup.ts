import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

vi.mock("lucide-react", () => ({
  AlertCircle: () => null,
  ArrowDownLeft: () => null,
  ArrowLeft: () => null,
  ArrowUpRight: () => null,
  Check: () => null,
  Clock: () => null,
  Eye: () => null,
  EyeOff: () => null,
  Home: () => null,
  RefreshCw: () => null,
  Send: () => null,
  User: () => null,
  UserPlus: () => null,
  Wallet: () => null,
  XCircle: () => null,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
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
