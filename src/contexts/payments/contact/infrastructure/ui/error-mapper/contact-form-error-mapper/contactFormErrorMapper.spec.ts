import { describe, expect, it } from "vitest";

import {
  DuplicateContactEmailError,
  DuplicateContactNameError,
  DuplicateContactPhoneError,
} from "#payments/contact/domain/errors";

import { ContactFormErrorMapper } from "./contactFormErrorMapper";

describe("ContactFormErrorMapper", () => {
  const mapper = new ContactFormErrorMapper();

  describe("Given a DuplicateContactNameError", () => {
    describe("When mapping to form error", () => {
      it("Then should map to name field with Spanish message", () => {
        const error = new DuplicateContactNameError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "name",
          message: "Ya existe un contacto con este nombre",
        });
      });
    });
  });

  describe("Given a DuplicateContactEmailError", () => {
    describe("When mapping to form error", () => {
      it("Then should map to email field with Spanish message", () => {
        const error = new DuplicateContactEmailError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "email",
          message: "Ya existe un contacto con este email",
        });
      });
    });
  });

  describe("Given a DuplicateContactPhoneError", () => {
    describe("When mapping to form error", () => {
      it("Then should map to phone field with Spanish message", () => {
        const error = new DuplicateContactPhoneError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "phone",
          message: "Ya existe un contacto con este teléfono",
        });
      });
    });
  });

  describe("Given a non-domain error", () => {
    describe("When mapping to form error", () => {
      it("Then should return null", () => {
        const error = new Error("Generic error");
        const result = mapper.toFormError(error);

        expect(result).toBeNull();
      });
    });
  });
});
