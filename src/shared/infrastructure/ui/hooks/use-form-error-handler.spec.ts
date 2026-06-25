/**
 * @vitest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ErrorPresentation,
  FormErrorMapping,
  IErrorMapper,
} from "../error-mapper";

import { useFormErrorHandler } from "./use-form-error-handler";

vi.mock("sileo", () => ({
  sileo: {
    error: vi.fn(),
  },
}));

class MockErrorMapperFormOnly implements IErrorMapper {
  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof Error && error.message === "ErrorFormOnly") {
      return {
        fieldName: "formOnlyField",
        message: "Only form error message",
      };
    }
    return null;
  }

  toPresentation(): ErrorPresentation | null {
    return null;
  }
}

class MockErrorMapperPresentationOnly implements IErrorMapper {
  toFormError(): FormErrorMapping | null {
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof Error && error.message === "ErrorPresentationOnly") {
      return {
        description: "Only toast description",
        title: "Only toast title",
      };
    }
    return null;
  }
}

class MockErrorMapperWithBoth implements IErrorMapper {
  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof Error && error.message === "ErrorWithBoth") {
      return {
        fieldName: "testField",
        message: "Field error message",
      };
    }
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof Error && error.message === "ErrorWithBoth") {
      return {
        description: "Toast description",
        title: "Toast title",
      };
    }
    return null;
  }
}

describe("useFormErrorHandler", () => {
  const mockSetError = vi.fn();
  const mockForm = { setError: mockSetError };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show toast and set form error when mapper returns both", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperWithBoth();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
      })
    );

    const error = new Error("ErrorWithBoth");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Toast description",
      title: "Toast title",
    });

    expect(mockSetError).toHaveBeenCalledWith("testField", {
      message: "Field error message",
      type: "manual",
    });
  });

  it("should only show toast when mapper returns only presentation", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperPresentationOnly();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
      })
    );

    const error = new Error("ErrorPresentationOnly");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Only toast description",
      title: "Only toast title",
    });

    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("should only set form error when mapper returns only form mapping", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperFormOnly();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
      })
    );

    const error = new Error("ErrorFormOnly");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Por favor, intenta nuevamente",
      title: "Error inesperado",
    });

    expect(mockSetError).toHaveBeenCalledWith("formOnlyField", {
      message: "Only form error message",
      type: "manual",
    });
  });

  it("should not show toast when showToast is false", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperWithBoth();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
        showToast: false,
      })
    );

    const error = new Error("ErrorWithBoth");
    result.current.handleError(error);

    expect(sileo.error).not.toHaveBeenCalled();

    expect(mockSetError).toHaveBeenCalledWith("testField", {
      message: "Field error message",
      type: "manual",
    });
  });

  it("should show fallback toast when no mapper handles error", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperWithBoth();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
      })
    );

    const error = new Error("UnknownError");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalledWith({
      description: "Por favor, intenta nuevamente",
      title: "Error inesperado",
    });

    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("should not set form error when no form mapping exists", async () => {
    const { sileo } = await import("sileo");
    const mapper = new MockErrorMapperPresentationOnly();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapper],
      })
    );

    const error = new Error("ErrorPresentationOnly");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("should try multiple mappers in order", async () => {
    const { sileo } = await import("sileo");
    const mapperA = new MockErrorMapperWithBoth();
    const mapperB = new MockErrorMapperFormOnly();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        mappers: [mapperA, mapperB],
      })
    );

    const error = new Error("ErrorFormOnly");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith("formOnlyField", {
      message: "Only form error message",
      type: "manual",
    });
  });
});
