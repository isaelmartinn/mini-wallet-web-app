import { describe, expect, it } from "vitest";

import {
  InvalidCredentialsError,
  ValidationError,
} from "#auth/session/domain/errors";
import {
  EmailEmptyError,
  EmailInvalidFormatError,
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
} from "#shared/domain/errors";

import { AuthErrorMapper } from "./authErrorMapper";

describe("AuthErrorMapper", () => {
  const mapper = new AuthErrorMapper();

  describe("Given domain errors", () => {
    describe("When toPresentation is called with InvalidCredentialsError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new InvalidCredentialsError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "Verifica tus credenciales e intenta nuevamente",
          title: "Credenciales inválidas",
        });
      });
    });

    describe("When toPresentation is called with EmailInvalidFormatError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new EmailInvalidFormatError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "El formato del email no es válido",
          title: "Email inválido",
        });
      });
    });

    describe("When toPresentation is called with EmailEmptyError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new EmailEmptyError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "El email no puede estar vacío",
          title: "Email vacío",
        });
      });
    });

    describe("When toPresentation is called with PhoneInvalidFormatError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new PhoneInvalidFormatError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description:
            "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
          title: "Teléfono inválido",
        });
      });
    });

    describe("When toPresentation is called with PhoneInvalidCountryCodeError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new PhoneInvalidCountryCodeError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "El teléfono debe comenzar con +52",
          title: "Código de país inválido",
        });
      });
    });

    describe("When toPresentation is called with PhoneEmptyError", () => {
      it("Then should map to Spanish presentation", () => {
        const error = new PhoneEmptyError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "El teléfono no puede estar vacío",
          title: "Teléfono vacío",
        });
      });
    });

    describe("When toPresentation is called with unmapped domain error", () => {
      it("Then should return generic validation error", () => {
        const error = new ValidationError("Custom validation message");
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "Custom validation message",
          title: "Error de validación",
        });
      });
    });
  });

  describe("Given non-domain errors", () => {
    describe("When toPresentation is called with generic Error", () => {
      it("Then should return null", () => {
        const error = new Error("Generic error");
        const result = mapper.toPresentation(error);

        expect(result).toBeNull();
      });
    });

    describe("When toPresentation is called with unknown error type", () => {
      it("Then should return null", () => {
        const error = { message: "Unknown error" };
        const result = mapper.toPresentation(error);

        expect(result).toBeNull();
      });
    });
  });
});
