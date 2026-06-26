import { describe, expect, it } from "vitest";

import { InvalidCredentialsError, ValidationError } from "#auth/domain/errors";
import {
  EmailEmptyError,
  EmailInvalidFormatError,
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
} from "#shared/domain/errors";

import { AuthFormErrorMapper } from "./auth-form-error-mapper";

describe("AuthFormErrorMapper", () => {
  const mapper = new AuthFormErrorMapper();

  describe("Given domain errors", () => {
    describe("When toFormError is called with EmailInvalidFormatError", () => {
      it("Then should map to credential field", () => {
        const error = new EmailInvalidFormatError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "El formato del email no es válido",
        });
      });
    });

    describe("When toFormError is called with EmailEmptyError", () => {
      it("Then should map to credential field", () => {
        const error = new EmailEmptyError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "El email no puede estar vacío",
        });
      });
    });

    describe("When toFormError is called with PhoneInvalidFormatError", () => {
      it("Then should map to credential field", () => {
        const error = new PhoneInvalidFormatError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message:
            "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
        });
      });
    });

    describe("When toFormError is called with PhoneInvalidCountryCodeError", () => {
      it("Then should map to credential field", () => {
        const error = new PhoneInvalidCountryCodeError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "El teléfono debe comenzar con +52",
        });
      });
    });

    describe("When toFormError is called with PhoneEmptyError", () => {
      it("Then should map to credential field", () => {
        const error = new PhoneEmptyError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "El teléfono no puede estar vacío",
        });
      });
    });

    describe("When toFormError is called with InvalidCredentialsError", () => {
      it("Then should map to credential field", () => {
        const error = new InvalidCredentialsError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "Credenciales inválidas",
        });
      });
    });

    describe("When toFormError is called with unmapped domain error", () => {
      it("Then should return fallback mapping", () => {
        const error = new ValidationError("Custom validation message");
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "credential",
          message: "Custom validation message",
        });
      });
    });
  });

  describe("Given non-domain errors", () => {
    describe("When toFormError is called with generic Error", () => {
      it("Then should return null", () => {
        const error = new Error("Generic error");
        const result = mapper.toFormError(error);

        expect(result).toBeNull();
      });
    });

    describe("When toFormError is called with unknown error type", () => {
      it("Then should return null", () => {
        const error = { message: "Unknown error" };
        const result = mapper.toFormError(error);

        expect(result).toBeNull();
      });
    });
  });
});
