/**
 * @vitest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ErrorPresentation,
  FormErrorMapping,
  IFormErrorMapper,
  IPresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

import { useFormErrorHandler } from "./useFormErrorHandler";

vi.mock("sileo", () => ({
  sileo: {
    error: vi.fn(),
  },
}));

class MockFormErrorMapper implements IFormErrorMapper {
  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof Error && error.message === "ErrorFormOnly") {
      return {
        fieldName: "formOnlyField",
        message: "Only form error message",
      };
    }
    if (error instanceof Error && error.message === "ErrorWithBoth") {
      return {
        fieldName: "testField",
        message: "Field error message",
      };
    }
    return null;
  }
}

class MockPresentationErrorMapper implements IPresentationErrorMapper {
  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof Error && error.message === "ErrorPresentationOnly") {
      return {
        description: "Only toast description",
        title: "Only toast title",
      };
    }
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

  it("should show toast and set form error when both mappers are provided", async () => {
    const { sileo } = await import("sileo");
    const formMapper = new MockFormErrorMapper();
    const presentationMapper = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        formErrorMappers: [formMapper],
        presentationMappers: [presentationMapper],
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

  it("should only show toast when only presentation mapper is provided", async () => {
    const { sileo } = await import("sileo");
    const presentationMapper = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        presentationMappers: [presentationMapper],
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

  it("should only set form error when only form mapper is provided", async () => {
    const { sileo } = await import("sileo");
    const formMapper = new MockFormErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        formErrorMappers: [formMapper],
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
    const formMapper = new MockFormErrorMapper();
    const presentationMapper = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        formErrorMappers: [formMapper],
        presentationMappers: [presentationMapper],
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
    const formMapper = new MockFormErrorMapper();
    const presentationMapper = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        formErrorMappers: [formMapper],
        presentationMappers: [presentationMapper],
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
    const presentationMapper = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        presentationMappers: [presentationMapper],
      })
    );

    const error = new Error("ErrorPresentationOnly");
    result.current.handleError(error);

    expect(sileo.error).toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("should try multiple mappers in order", async () => {
    const { sileo } = await import("sileo");
    const formMapperA = new MockFormErrorMapper();
    const presentationMapperA = new MockPresentationErrorMapper();

    const { result } = renderHook(() =>
      useFormErrorHandler({
        form: mockForm,
        formErrorMappers: [formMapperA],
        presentationMappers: [presentationMapperA],
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
