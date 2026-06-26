import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Transaction } from "#transactions/domain";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";
import { MovementsList } from "#transactions/infrastructure/ui/components/organisms/movements-list/movements-list";

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
          Transaction.create({
            amount: 1500.0,
            date: new Date("2024-06-25T10:30:00"),
            description: "Transferencia a María García",
            id: "txn-001",
            status: TransactionStatus.success(),
            type: TransactionType.expense(),
          }),
          Transaction.create({
            amount: 3200.5,
            date: new Date("2024-06-23T15:45:00"),
            description: "Pago recibido de Juan Pérez",
            id: "txn-002",
            status: TransactionStatus.success(),
            type: TransactionType.income(),
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
