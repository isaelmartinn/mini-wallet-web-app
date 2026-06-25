import { describe, expect, it } from "vitest";

import {
  EmailInvalidFormatError,
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
} from "#auth/domain/errors";
import { Email, Phone } from "#auth/domain/value-objects";

import { CredentialFactory } from "./credential-factory.service";

describe("CredentialFactory Service", () => {
  describe("Given a valid email string", () => {
    describe("When creating a credential from string", () => {
      it("Then should return an Email instance", () => {
        const credential =
          CredentialFactory.createFromString("test@example.com");

        expect(credential).toBeInstanceOf(Email);
        expect(credential.getValue()).toBe("test@example.com");
      });

      it("Then should handle uppercase emails", () => {
        const credential =
          CredentialFactory.createFromString("Test@Example.COM");

        expect(credential).toBeInstanceOf(Email);
        expect(credential.getValue()).toBe("test@example.com");
      });

      it("Then should handle emails with whitespace", () => {
        const credential = CredentialFactory.createFromString(
          "  test@example.com  "
        );

        expect(credential).toBeInstanceOf(Email);
        expect(credential.getValue()).toBe("test@example.com");
      });
    });
  });

  describe("Given a valid phone string", () => {
    describe("When creating a credential from string", () => {
      it("Then should return a Phone instance", () => {
        const credential = CredentialFactory.createFromString("+525512345678");

        expect(credential).toBeInstanceOf(Phone);
        expect(credential.getValue()).toBe("+525512345678");
      });

      it("Then should handle phone with spaces", () => {
        const credential =
          CredentialFactory.createFromString("+52 55 1234 5678");

        expect(credential).toBeInstanceOf(Phone);
        expect(credential.getValue()).toBe("+525512345678");
      });

      it("Then should handle phone with dashes", () => {
        const credential =
          CredentialFactory.createFromString("+52-55-1234-5678");

        expect(credential).toBeInstanceOf(Phone);
        expect(credential.getValue()).toBe("+525512345678");
      });

      it("Then should handle phone with parentheses", () => {
        const credential =
          CredentialFactory.createFromString("+52(55)1234-5678");

        expect(credential).toBeInstanceOf(Phone);
        expect(credential.getValue()).toBe("+525512345678");
      });
    });
  });

  describe("Given an invalid email string", () => {
    describe("When creating a credential from string", () => {
      it("Then should throw EmailInvalidFormatError for @ only", () => {
        expect(() => CredentialFactory.createFromString("@")).toThrow(
          EmailInvalidFormatError
        );
      });

      it("Then should throw EmailInvalidFormatError for invalid email format", () => {
        expect(() => CredentialFactory.createFromString("invalid@")).toThrow(
          EmailInvalidFormatError
        );
      });

      it("Then should throw EmailInvalidFormatError for missing domain", () => {
        expect(() => CredentialFactory.createFromString("test@domain")).toThrow(
          EmailInvalidFormatError
        );
      });
    });
  });

  describe("Given an invalid phone string", () => {
    describe("When creating a credential from string", () => {
      it("Then should throw PhoneEmptyError for empty string", () => {
        expect(() => CredentialFactory.createFromString("")).toThrow(
          PhoneEmptyError
        );
      });

      it("Then should throw PhoneInvalidCountryCodeError for missing country code", () => {
        expect(() => CredentialFactory.createFromString("5512345678")).toThrow(
          PhoneInvalidCountryCodeError
        );
      });

      it("Then should throw PhoneInvalidFormatError for invalid phone format", () => {
        expect(() => CredentialFactory.createFromString("+52123")).toThrow(
          PhoneInvalidFormatError
        );
      });

      it("Then should throw PhoneInvalidCountryCodeError for wrong country code", () => {
        expect(() =>
          CredentialFactory.createFromString("+15512345678")
        ).toThrow(PhoneInvalidCountryCodeError);
      });
    });
  });

  describe("Given edge cases", () => {
    describe("When creating a credential from string", () => {
      it("Then should treat string with @ as email even if invalid", () => {
        expect(() => CredentialFactory.createFromString("notanemail@")).toThrow(
          EmailInvalidFormatError
        );
      });

      it("Then should treat string without @ as phone even if invalid", () => {
        expect(() => CredentialFactory.createFromString("123456")).toThrow(
          PhoneInvalidCountryCodeError
        );
      });
    });
  });
});
