import { describe, expect, it } from "vitest";

import {
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
} from "#shared/domain/errors";

import { Phone } from "./phone.vo";

describe("Phone Value Object", () => {
  describe("Given a valid Mexican phone number", () => {
    describe("When creating a Phone instance", () => {
      it("Then should create successfully with +52 prefix", () => {
        const phone = Phone.create("+525512345678");

        expect(phone).toBeInstanceOf(Phone);
        expect(phone.getValue()).toBe("+525512345678");
      });

      it("Then should clean formatting characters", () => {
        const phone = Phone.create("+52 55 1234 5678");

        expect(phone.getValue()).toBe("+525512345678");
      });

      it("Then should clean hyphens and parentheses", () => {
        const phone = Phone.create("+52 (55) 1234-5678");

        expect(phone.getValue()).toBe("+525512345678");
      });
    });
  });

  describe("Given an empty phone number", () => {
    describe("When creating a Phone instance", () => {
      it("Then should throw PhoneEmptyError", () => {
        expect(() => Phone.create("")).toThrow(PhoneEmptyError);
        expect(() => Phone.create("")).toThrow("Phone cannot be empty");
      });

      it("Then should throw PhoneEmptyError for whitespace only", () => {
        expect(() => Phone.create("   ")).toThrow(PhoneEmptyError);
      });
    });
  });

  describe("Given a phone number without Mexican country code", () => {
    describe("When creating a Phone instance", () => {
      it("Then should throw PhoneInvalidCountryCodeError for no country code", () => {
        expect(() => Phone.create("5512345678")).toThrow(
          PhoneInvalidCountryCodeError
        );
        expect(() => Phone.create("5512345678")).toThrow(
          "Phone must have Mexican country code (+52)"
        );
      });

      it("Then should throw PhoneInvalidCountryCodeError for US country code", () => {
        expect(() => Phone.create("+15551234567")).toThrow(
          PhoneInvalidCountryCodeError
        );
      });

      it("Then should throw PhoneInvalidCountryCodeError for other country codes", () => {
        expect(() => Phone.create("+34612345678")).toThrow(
          PhoneInvalidCountryCodeError
        );
        expect(() => Phone.create("+441234567890")).toThrow(
          PhoneInvalidCountryCodeError
        );
      });
    });
  });

  describe("Given an invalid phone format", () => {
    describe("When creating a Phone instance", () => {
      it("Then should throw PhoneInvalidFormatError for too few digits", () => {
        expect(() => Phone.create("+52551234567")).toThrow(
          PhoneInvalidFormatError
        );
        expect(() => Phone.create("+52551234567")).toThrow(
          "Invalid phone format"
        );
      });

      it("Then should throw PhoneInvalidFormatError for too many digits", () => {
        expect(() => Phone.create("+5255123456789")).toThrow(
          PhoneInvalidFormatError
        );
      });

      it("Then should throw PhoneInvalidFormatError for letters", () => {
        expect(() => Phone.create("+52551234567a")).toThrow(
          PhoneInvalidFormatError
        );
      });

      it("Then should throw PhoneInvalidFormatError for special characters after cleaning", () => {
        expect(() => Phone.create("+52#5512345678")).toThrow(
          PhoneInvalidFormatError
        );
      });
    });
  });

  describe("Given two Phone instances", () => {
    describe("When comparing for equality", () => {
      it("Then should return true for same phone values", () => {
        const phone1 = Phone.create("+525512345678");
        const phone2 = Phone.create("+525512345678");

        expect(phone1.equals(phone2)).toBe(true);
      });

      it("Then should return true for same phone with different formatting", () => {
        const phone1 = Phone.create("+52 55 1234 5678");
        const phone2 = Phone.create("+525512345678");

        expect(phone1.equals(phone2)).toBe(true);
      });

      it("Then should return false for different phone values", () => {
        const phone1 = Phone.create("+525512345678");
        const phone2 = Phone.create("+525587654321");

        expect(phone1.equals(phone2)).toBe(false);
      });
    });
  });
});
