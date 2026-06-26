import { describe, expect, it } from "vitest";

import {
  DuplicateContactEmailError,
  DuplicateContactNameError,
  DuplicateContactPhoneError,
} from "#payments/contact/domain/errors";

import { ContactErrorMapper } from "./contactErrorMapper";

describe("ContactErrorMapper", () => {
  const mapper = new ContactErrorMapper();

  describe("Given a DuplicateContactNameError", () => {
    describe("When mapping to presentation", () => {
      it("Then should return Spanish error message for name duplicate", () => {
        const error = new DuplicateContactNameError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "Ya existe un contacto con este nombre",
          title: "Nombre duplicado",
        });
      });
    });
  });

  describe("Given a DuplicateContactEmailError", () => {
    describe("When mapping to presentation", () => {
      it("Then should return Spanish error message for email duplicate", () => {
        const error = new DuplicateContactEmailError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "Ya existe un contacto con este email",
          title: "Email duplicado",
        });
      });
    });
  });

  describe("Given a DuplicateContactPhoneError", () => {
    describe("When mapping to presentation", () => {
      it("Then should return Spanish error message for phone duplicate", () => {
        const error = new DuplicateContactPhoneError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "Ya existe un contacto con este teléfono",
          title: "Teléfono duplicado",
        });
      });
    });
  });

  describe("Given a non-domain error", () => {
    describe("When mapping to presentation", () => {
      it("Then should return null", () => {
        const error = new Error("Generic error");
        const result = mapper.toPresentation(error);

        expect(result).toBeNull();
      });
    });
  });
});
