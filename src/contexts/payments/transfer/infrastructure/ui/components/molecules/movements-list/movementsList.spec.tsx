import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Transfer } from "#payments/transfer/domain";
import { TransferAmount } from "#payments/transfer/domain/value-objects/transfer-amount/transferAmount.vo";
import { TransferStatus } from "#payments/transfer/domain/value-objects/transfer-status/transferStatus.vo";
import { TransferType } from "#payments/transfer/domain/value-objects/transfer-type/transferType.vo";

import { MovementsList } from "./movementsList";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsList", () => {
  describe("Given a list of transactions", () => {
    describe("When rendering the component", () => {
      it("Then should display the header", () => {
        const transactions = [
          Transfer.create({
            amount: TransferAmount.create(1500.0),
            date: new Date("2024-06-25T10:30:00"),
            description: "Transferencia a María García",
            id: "txn-001",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
        ];

        renderWithChakra(<MovementsList transactions={transactions} />);

        expect(screen.getByText("Movimientos recientes")).toBeInTheDocument();
      });

      it("Then should display all transactions", () => {
        const transactions = [
          Transfer.create({
            amount: TransferAmount.create(1500.0),
            date: new Date("2024-06-25T10:30:00"),
            description: "Transferencia a María García",
            id: "txn-001",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
          Transfer.create({
            amount: TransferAmount.create(3200.5),
            date: new Date("2024-06-23T15:45:00"),
            description: "Pago recibido de Juan Pérez",
            id: "txn-002",
            recipientId: "recipient-2",
            status: TransferStatus.success(),
            type: TransferType.income(),
            userId: "user-1",
          }),
        ];

        renderWithChakra(<MovementsList transactions={transactions} />);

        expect(
          screen.getByText("Transferencia a María García")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Pago recibido de Juan Pérez")
        ).toBeInTheDocument();
      });

      it("Then should display movements list testid", () => {
        const transactions = [
          Transfer.create({
            amount: TransferAmount.create(1500.0),
            date: new Date("2024-06-25T10:30:00"),
            description: "Test transaction",
            id: "txn-001",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
        ];

        renderWithChakra(<MovementsList transactions={transactions} />);

        expect(screen.getByTestId("movements-list")).toBeInTheDocument();
      });
    });

    describe("When there are many transactions", () => {
      it("Then should render all transactions", () => {
        const transactions = Array.from({ length: 10 }, (_, index) =>
          Transfer.create({
            amount: TransferAmount.create(100 * (index + 1)),
            date: new Date(),
            description: `Transaction ${index + 1}`,
            id: `txn-${index}`,
            recipientId: `recipient-${index}`,
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          })
        );

        renderWithChakra(<MovementsList transactions={transactions} />);

        expect(screen.getByText("Transaction 1")).toBeInTheDocument();
        expect(screen.getByText("Transaction 10")).toBeInTheDocument();
      });
    });
  });
});
