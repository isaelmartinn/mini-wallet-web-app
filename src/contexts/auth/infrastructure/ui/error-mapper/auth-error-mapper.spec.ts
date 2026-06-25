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

describe("AuthErrorMapper", () => {
  const mapper = new AuthErrorMapper();

  describe("toPresentation", () => {
    it("should map InvalidCredentialsError to Spanish presentation", () => {
      const error = new InvalidCredentialsError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "Verifica tus credenciales e intenta nuevamente",
        title: "Credenciales inválidas",
      });
    });

    it("should map EmailInvalidFormatError to Spanish presentation", () => {
      const error = new EmailInvalidFormatError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "El formato del email no es válido",
        title: "Email inválido",
      });
    });

    it("should map EmailEmptyError to Spanish presentation", () => {
      const error = new EmailEmptyError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "El email no puede estar vacío",
        title: "Email vacío",
      });
    });

    it("should map PhoneInvalidFormatError to Spanish presentation", () => {
      const error = new PhoneInvalidFormatError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description:
          "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
        title: "Teléfono inválido",
      });
    });

    it("should map PhoneInvalidCountryCodeError to Spanish presentation", () => {
      const error = new PhoneInvalidCountryCodeError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "El teléfono debe comenzar con +52",
        title: "Código de país inválido",
      });
    });

    it("should map PhoneEmptyError to Spanish presentation", () => {
      const error = new PhoneEmptyError();
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "El teléfono no puede estar vacío",
        title: "Teléfono vacío",
      });
    });

    it("should return generic validation error for unmapped domain error", () => {
      const error = new ValidationError("Custom validation message");
      const result = mapper.toPresentation(error);

      expect(result).toEqual({
        description: "Custom validation message",
        title: "Error de validación",
      });
    });

    it("should return null for non-domain errors", () => {
      const error = new Error("Generic error");
      const result = mapper.toPresentation(error);

      expect(result).toBeNull();
    });

    it("should return null for unknown error types", () => {
      const error = { message: "Unknown error" };
      const result = mapper.toPresentation(error);

      expect(result).toBeNull();
    });
  });
});
