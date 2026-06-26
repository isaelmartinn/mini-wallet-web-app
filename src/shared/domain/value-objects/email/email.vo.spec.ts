import { describe, expect, it } from "vitest";

import {
  EmailEmptyError,
  EmailInvalidFormatError,
} from "#shared/domain/errors";

import { Email } from "./email.vo";

describe("Email Value Object", () => {
  describe("Given a valid email address", () => {
    describe("When creating an Email instance", () => {
      it("Then should create successfully and store lowercase value", () => {
        const email = Email.create("Test@Example.com");

        expect(email).toBeInstanceOf(Email);
        expect(email.getValue()).toBe("test@example.com");
      });

      it("Then should trim whitespace from input", () => {
        const email = Email.create("  test@example.com  ");

        expect(email.getValue()).toBe("test@example.com");
      });
    });
  });

  describe("Given an empty email", () => {
    describe("When creating an Email instance", () => {
      it("Then should throw EmailEmptyError", () => {
        expect(() => Email.create("")).toThrow(EmailEmptyError);
        expect(() => Email.create("")).toThrow("Email cannot be empty");
      });

      it("Then should throw EmailEmptyError for whitespace only", () => {
        expect(() => Email.create("   ")).toThrow(EmailEmptyError);
      });
    });
  });

  describe("Given an invalid email format", () => {
    describe("When creating an Email instance", () => {
      it("Then should throw EmailInvalidFormatError for missing @", () => {
        expect(() => Email.create("invalid.email.com")).toThrow(
          EmailInvalidFormatError
        );
        expect(() => Email.create("invalid.email.com")).toThrow(
          "Invalid email format"
        );
      });

      it("Then should throw EmailInvalidFormatError for missing domain", () => {
        expect(() => Email.create("invalid@")).toThrow(EmailInvalidFormatError);
      });

      it("Then should throw EmailInvalidFormatError for missing local part", () => {
        expect(() => Email.create("@example.com")).toThrow(
          EmailInvalidFormatError
        );
      });

      it("Then should throw EmailInvalidFormatError for missing TLD", () => {
        expect(() => Email.create("invalid@domain")).toThrow(
          EmailInvalidFormatError
        );
      });

      it("Then should throw EmailInvalidFormatError for spaces", () => {
        expect(() => Email.create("invalid email@example.com")).toThrow(
          EmailInvalidFormatError
        );
      });
    });
  });

  describe("Given two Email instances", () => {
    describe("When comparing for equality", () => {
      it("Then should return true for same email values", () => {
        const email1 = Email.create("test@example.com");
        const email2 = Email.create("test@example.com");

        expect(email1.equals(email2)).toBe(true);
      });

      it("Then should return true for same email with different casing", () => {
        const email1 = Email.create("Test@Example.com");
        const email2 = Email.create("test@example.com");

        expect(email1.equals(email2)).toBe(true);
      });

      it("Then should return false for different email values", () => {
        const email1 = Email.create("test1@example.com");
        const email2 = Email.create("test2@example.com");

        expect(email1.equals(email2)).toBe(false);
      });
    });
  });
});
