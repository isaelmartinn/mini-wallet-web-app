import { describe, expect, it } from "vitest";

import {
  EmailEmptyError,
  EmailInvalidFormatError,
  InvalidCredentialsError,
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
  ValidationError,
} from "#auth/domain/errors";

import { AuthErrorMapper } from "./auth-error-mapper";

describe("AuthErrorMapper - toFormError", () => {
  const mapper = new AuthErrorMapper();

  describe("toFormError", () => {
    it("should map EmailInvalidFormatError to credential field", () => {
      const error = new EmailInvalidFormatError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "El formato del email no es válido",
      });
    });

    it("should map EmailEmptyError to credential field", () => {
      const error = new EmailEmptyError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "El email no puede estar vacío",
      });
    });

    it("should map PhoneInvalidFormatError to credential field", () => {
      const error = new PhoneInvalidFormatError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message:
          "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
      });
    });

    it("should map PhoneInvalidCountryCodeError to credential field", () => {
      const error = new PhoneInvalidCountryCodeError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "El teléfono debe comenzar con +52",
      });
    });

    it("should map PhoneEmptyError to credential field", () => {
      const error = new PhoneEmptyError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "El teléfono no puede estar vacío",
      });
    });

    it("should map InvalidCredentialsError to credential field", () => {
      const error = new InvalidCredentialsError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "Credenciales inválidas",
      });
    });

    it("should return fallback mapping for unmapped domain error", () => {
      const error = new ValidationError("Custom validation message");
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "Custom validation message",
      });
    });

    it("should return null for non-domain errors", () => {
      const error = new Error("Generic error");
      const result = mapper.toFormError(error);

      expect(result).toBeNull();
    });

    it("should return null for unknown error types", () => {
      const error = { message: "Unknown error" };
      const result = mapper.toFormError(error);

      expect(result).toBeNull();
    });
  });
});
