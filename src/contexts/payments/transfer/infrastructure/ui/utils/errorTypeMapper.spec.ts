import { describe, expect, it } from "vitest";

import {
  InsufficientBalanceError,
  TransferNetworkError,
  TransferTimeoutError,
} from "#payments/transfer/domain/errors";

import { mapDomainErrorToType } from "./errorTypeMapper";

describe("mapDomainErrorToType", () => {
  describe("Given an InsufficientBalanceError", () => {
    describe("When mapping the error", () => {
      it("Then should return INSUFFICIENT_FUNDS type", () => {
        const error = new InsufficientBalanceError();

        const result = mapDomainErrorToType(error);

        expect(result).toBe("INSUFFICIENT_FUNDS");
      });
    });
  });

  describe("Given a TransferNetworkError", () => {
    describe("When mapping the error", () => {
      it("Then should return NETWORK_ERROR type", () => {
        const error = new TransferNetworkError();

        const result = mapDomainErrorToType(error);

        expect(result).toBe("NETWORK_ERROR");
      });
    });
  });

  describe("Given a TransferTimeoutError", () => {
    describe("When mapping the error", () => {
      it("Then should return TIMEOUT type", () => {
        const error = new TransferTimeoutError();

        const result = mapDomainErrorToType(error);

        expect(result).toBe("TIMEOUT");
      });
    });
  });

  describe("Given a non-DomainError", () => {
    describe("When mapping the error", () => {
      it("Then should return UNKNOWN_ERROR type", () => {
        const error = new Error("Generic error");

        const result = mapDomainErrorToType(error);

        expect(result).toBe("UNKNOWN_ERROR");
      });
    });
  });

  describe("Given an unknown value", () => {
    describe("When mapping the error", () => {
      it("Then should return UNKNOWN_ERROR type", () => {
        const result = mapDomainErrorToType("not an error");

        expect(result).toBe("UNKNOWN_ERROR");
      });
    });
  });
});
