import { describe, expect, it } from "vitest";

import { IntlCurrencyFormatter } from "./intlCurrencyFormatter";

describe("IntlCurrencyFormatter", () => {
  describe("Given a formatter with default locale (es-MX)", () => {
    describe("When formatting a positive amount in MXN", () => {
      it("Then should format with Mexican peso symbol", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(1000, "MXN");

        expect(result).toBe("$1,000.00");
      });

      it("Then should format decimal amounts correctly", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(1234.56, "MXN");

        expect(result).toBe("$1,234.56");
      });

      it("Then should format zero correctly", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(0, "MXN");

        expect(result).toBe("$0.00");
      });
    });

    describe("When formatting negative amounts", () => {
      it("Then should format with negative sign", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(-500, "MXN");

        expect(result).toBe("-$500.00");
      });
    });

    describe("When formatting large amounts", () => {
      it("Then should format with thousands separators", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(1000000, "MXN");

        expect(result).toBe("$1,000,000.00");
      });
    });

    describe("When formatting amounts with many decimals", () => {
      it("Then should round to two decimal places", () => {
        const formatter = new IntlCurrencyFormatter();
        const result = formatter.format(123.456789, "MXN");

        expect(result).toBe("$123.46");
      });
    });
  });

  describe("Given a formatter with custom locale", () => {
    describe("When formatting with en-US locale", () => {
      it("Then should format with US conventions", () => {
        const formatter = new IntlCurrencyFormatter("en-US");
        const result = formatter.format(1000, "USD");

        expect(result).toBe("$1,000.00");
      });
    });

    describe("When formatting with es-ES locale", () => {
      it("Then should format with Spanish conventions", () => {
        const formatter = new IntlCurrencyFormatter("es-ES");
        const result = formatter.format(1000, "EUR");

        expect(result).toContain("1");
        expect(result).toContain("000");
        expect(result).toContain("€");
      });
    });
  });

  describe("Given different currencies", () => {
    describe("When formatting USD", () => {
      it("Then should use dollar symbol", () => {
        const formatter = new IntlCurrencyFormatter("en-US");
        const result = formatter.format(100, "USD");

        expect(result).toBe("$100.00");
      });
    });

    describe("When formatting EUR", () => {
      it("Then should use euro symbol", () => {
        const formatter = new IntlCurrencyFormatter("en-US");
        const result = formatter.format(100, "EUR");

        expect(result).toContain("€");
        expect(result).toContain("100");
      });
    });
  });
});
