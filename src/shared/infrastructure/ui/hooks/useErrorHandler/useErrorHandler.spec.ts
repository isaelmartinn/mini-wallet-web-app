/**
 * @vitest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ErrorPresentation,
  IErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

import { useErrorHandler } from "./useErrorHandler";

vi.mock("sileo", () => ({
  sileo: {
    error: vi.fn(),
  },
}));

class MockErrorMapperA implements IErrorMapper {
  toFormError(): null {
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof Error && error.message === "ErrorA") {
      return {
        description: "Description A",
        title: "Title A",
      };
    }
    return null;
  }
}

class MockErrorMapperB implements IErrorMapper {
  toFormError(): null {
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof Error && error.message === "ErrorB") {
      return {
        description: "Description B",
        title: "Title B",
      };
    }
    return null;
  }
}

describe("useErrorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call first mapper that returns non-null", async () => {
    const { sileo } = await import("sileo");
    const mapperA = new MockErrorMapperA();
    const mapperB = new MockErrorMapperB();

    const { result } = renderHook(() => useErrorHandler([mapperA, mapperB]));

    const error = new Error("ErrorA");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Description A",
      title: "Title A",
    });
  });

  it("should try all mappers in order (Chain of Responsibility)", async () => {
    const { sileo } = await import("sileo");
    const mapperA = new MockErrorMapperA();
    const mapperB = new MockErrorMapperB();

    const { result } = renderHook(() => useErrorHandler([mapperA, mapperB]));

    const error = new Error("ErrorB");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Description B",
      title: "Title B",
    });
  });

  it("should fall back to generic error if all mappers return null", async () => {
    const { sileo } = await import("sileo");
    const mapperA = new MockErrorMapperA();
    const mapperB = new MockErrorMapperB();

    const { result } = renderHook(() => useErrorHandler([mapperA, mapperB]));

    const error = new Error("UnknownError");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Por favor, intenta nuevamente",
      title: "Error inesperado",
    });
  });

  it("should handle errors when no mappers are provided", async () => {
    const { sileo } = await import("sileo");

    const { result } = renderHook(() => useErrorHandler([]));

    const error = new Error("SomeError");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Por favor, intenta nuevamente",
      title: "Error inesperado",
    });
  });

  it("should handle non-Error objects", async () => {
    const { sileo } = await import("sileo");
    const mapperA = new MockErrorMapperA();

    const { result } = renderHook(() => useErrorHandler([mapperA]));

    const error = { message: "Not an Error instance" };
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Por favor, intenta nuevamente",
      title: "Error inesperado",
    });
  });
});
