import { describe, expect, it } from "vitest";

import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { AmountMustBeGreaterThanZeroError } from "#shared/domain/errors";

import { TransferFormErrorMapper } from "./transferFormErrorMapper";

describe("TransferFormErrorMapper", () => {
  const mapper = new TransferFormErrorMapper();

  describe("Given an AmountMustBeGreaterThanZeroError", () => {
    describe("When mapping to presentation", () => {
      it("Then should return correct error presentation", () => {
        const error = new AmountMustBeGreaterThanZeroError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description: "El monto debe ser mayor a cero",
          title: "Monto inválido",
        });
      });
    });

    describe("When mapping to form error", () => {
      it("Then should return correct field mapping", () => {
        const error = new AmountMustBeGreaterThanZeroError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "amount",
          message: "El monto debe ser mayor a cero",
        });
      });
    });
  });

  describe("Given an InsufficientBalanceError", () => {
    describe("When mapping to presentation", () => {
      it("Then should return correct error presentation", () => {
        const error = new InsufficientBalanceError();
        const result = mapper.toPresentation(error);

        expect(result).toEqual({
          description:
            "No tienes saldo suficiente para realizar esta transacción",
          title: "Saldo insuficiente",
        });
      });
    });

    describe("When mapping to form error", () => {
      it("Then should return correct field mapping", () => {
        const error = new InsufficientBalanceError();
        const result = mapper.toFormError(error);

        expect(result).toEqual({
          fieldName: "amount",
          message: "No tienes saldo suficiente",
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

    describe("When mapping to form error", () => {
      it("Then should return null", () => {
        const error = new Error("Generic error");
        const result = mapper.toFormError(error);

        expect(result).toBeNull();
      });
    });
  });
});
