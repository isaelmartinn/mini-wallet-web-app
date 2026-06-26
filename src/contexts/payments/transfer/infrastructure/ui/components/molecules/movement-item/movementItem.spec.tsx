import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Transaction } from "#transactions/domain";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

import { MovementItem } from "./movementItem";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementItem", () => {
  describe("Given a successful expense transaction", () => {
    describe("When rendering the component", () => {
      it("Then should display transaction details with negative amount", () => {
        const transaction = Transaction.create({
          amount: 1500.0,
          date: new Date("2024-06-25T10:30:00"),
          description: "Transferencia a María García",
          id: "txn-001",
          status: TransactionStatus.success(),
          type: TransactionType.expense(),
        });

        renderWithChakra(<MovementItem transaction={transaction} />);

        expect(
          screen.getByText("Transferencia a María García")
        ).toBeInTheDocument();
        expect(screen.getByText(/25 de junio, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/10:30/i)).toBeInTheDocument();
        expect(screen.getByText(/-\$1,500\.00/)).toBeInTheDocument();
      });

      it("Then should not display status text", () => {
        const transaction = Transaction.create({
          amount: 1500.0,
          date: new Date("2024-06-25T10:30:00"),
          description: "Test transaction",
          id: "txn-001",
          status: TransactionStatus.success(),
          type: TransactionType.expense(),
        });

        renderWithChakra(<MovementItem transaction={transaction} />);

        expect(screen.queryByText("Pendiente")).not.toBeInTheDocument();
        expect(screen.queryByText("Fallida")).not.toBeInTheDocument();
      });
    });
  });

  describe("Given a successful income transaction", () => {
    describe("When rendering the component", () => {
      it("Then should display transaction details with positive amount", () => {
        const transaction = Transaction.create({
          amount: 3200.5,
          date: new Date("2024-06-23T15:45:00"),
          description: "Pago recibido de Juan Pérez",
          id: "txn-002",
          status: TransactionStatus.success(),
          type: TransactionType.income(),
        });

        renderWithChakra(<MovementItem transaction={transaction} />);

        expect(
          screen.getByText("Pago recibido de Juan Pérez")
        ).toBeInTheDocument();
        expect(screen.getByText(/23 de junio, 2024/i)).toBeInTheDocument();
        expect(screen.getByText(/15:45/i)).toBeInTheDocument();
        expect(screen.getByText(/\+\$3,200\.50/)).toBeInTheDocument();
      });
    });
  });

  describe("Given a pending transaction", () => {
    describe("When rendering the component", () => {
      it("Then should display pending status", () => {
        const transaction = Transaction.create({
          amount: 500.0,
          date: new Date("2024-06-21T18:20:00"),
          description: "Transferencia a Carlos López",
          id: "txn-004",
          status: TransactionStatus.pending(),
          type: TransactionType.expense(),
        });

        renderWithChakra(<MovementItem transaction={transaction} />);

        expect(screen.getByText("Pendiente")).toBeInTheDocument();
      });
    });
  });

  describe("Given a failed transaction", () => {
    describe("When rendering the component", () => {
      it("Then should display failed status", () => {
        const transaction = Transaction.create({
          amount: 450.75,
          date: new Date("2024-06-19T14:30:00"),
          description: "Pago de servicios",
          id: "txn-006",
          status: TransactionStatus.failed(),
          type: TransactionType.expense(),
        });

        renderWithChakra(<MovementItem transaction={transaction} />);

        expect(screen.getByText("Fallida")).toBeInTheDocument();
      });
    });
  });
});
