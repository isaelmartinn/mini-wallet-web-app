import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain";
import { TransferStatus } from "#payments/transfer/domain/value-objects/transfer-status/transferStatus.vo";
import { TransferType } from "#payments/transfer/domain/value-objects/transfer-type/transferType.vo";
import { Amount } from "#shared/domain/value-objects";

import { MovementsList } from "./movementsList";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsList", () => {
  describe("Given loading state", () => {
    describe("When rendering the component", () => {
      it("Then should display loading spinner", () => {
        renderWithChakra(
          <MovementsList error={null} isLoading={true} transactions={[]} />
        );

        expect(screen.getByText("Cargando movimientos...")).toBeInTheDocument();
      });
    });
  });

  describe("Given an error state", () => {
    describe("When rendering the component", () => {
      it("Then should display error message", () => {
        const errorMessage = "Error al cargar las transacciones";

        renderWithChakra(
          <MovementsList
            error={errorMessage}
            isLoading={false}
            transactions={[]}
          />
        );

        expect(
          screen.getByText("Error al cargar movimientos")
        ).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("Given an empty transactions list", () => {
    describe("When rendering the component", () => {
      it("Then should display empty state message", () => {
        renderWithChakra(
          <MovementsList error={null} isLoading={false} transactions={[]} />
        );

        expect(screen.getByText("No hay movimientos")).toBeInTheDocument();
        expect(
          screen.getByText("Aún no tienes transacciones registradas")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Given a list of transactions", () => {
    describe("When rendering the component", () => {
      it("Then should display all transactions", () => {
        const transactions = [
          Transfer.create({
            amount: Amount.create(1500.0),
            date: new Date("2024-06-25T10:30:00"),
            description: "Transferencia a María García",
            id: "txn-001",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
          Transfer.create({
            amount: Amount.create(3200.5),
            date: new Date("2024-06-23T15:45:00"),
            description: "Pago recibido de Juan Pérez",
            id: "txn-002",
            recipientId: "recipient-2",
            status: TransferStatus.success(),
            type: TransferType.income(),
            userId: "user-1",
          }),
        ];

        renderWithChakra(
          <MovementsList
            error={null}
            isLoading={false}
            transactions={transactions}
          />
        );

        expect(screen.getByText("Movimientos recientes")).toBeInTheDocument();
        expect(
          screen.getByText("Transferencia a María García")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Pago recibido de Juan Pérez")
        ).toBeInTheDocument();
      });
    });
  });
});
