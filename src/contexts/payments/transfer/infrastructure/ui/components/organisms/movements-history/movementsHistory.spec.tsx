import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Transfer } from "#payments/transfer/domain";
import { TransferAmount } from "#payments/transfer/domain/value-objects/transfer-amount/transferAmount.vo";
import { TransferStatus } from "#payments/transfer/domain/value-objects/transfer-status/transferStatus.vo";
import { TransferType } from "#payments/transfer/domain/value-objects/transfer-type/transferType.vo";

import { MovementsHistory } from "./movementsHistory";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsHistory", () => {
  describe("Given loading state", () => {
    describe("When rendering the component", () => {
      it("Then should display loading state", () => {
        renderWithChakra(
          <MovementsHistory error={null} isLoading={true} transactions={[]} />
        );

        expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      });
    });
  });

  describe("Given an error state", () => {
    describe("When rendering the component", () => {
      it("Then should display error state with message", () => {
        const errorMessage = "Error al cargar las transacciones";

        renderWithChakra(
          <MovementsHistory
            error={errorMessage}
            isLoading={false}
            transactions={[]}
          />
        );

        expect(screen.getByTestId("error-state")).toBeInTheDocument();
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          errorMessage
        );
      });
    });
  });

  describe("Given an empty transactions list", () => {
    describe("When rendering the component", () => {
      it("Then should display empty state", () => {
        renderWithChakra(
          <MovementsHistory error={null} isLoading={false} transactions={[]} />
        );

        expect(screen.getByTestId("empty-state")).toBeInTheDocument();
        expect(screen.getByTestId("empty-title")).toHaveTextContent(
          "No hay movimientos"
        );
      });
    });
  });

  describe("Given a list of transactions", () => {
    describe("When rendering the component", () => {
      it("Then should display movements list", () => {
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

        renderWithChakra(
          <MovementsHistory
            error={null}
            isLoading={false}
            transactions={transactions}
          />
        );

        expect(screen.getByTestId("movements-list")).toBeInTheDocument();
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

  describe("Given state transitions", () => {
    describe("When loading completes with data", () => {
      it("Then should transition from loading to list", () => {
        const transactions = [
          Transfer.create({
            amount: TransferAmount.create(1000.0),
            date: new Date(),
            description: "Test transaction",
            id: "txn-001",
            recipientId: "recipient-1",
            status: TransferStatus.success(),
            type: TransferType.expense(),
            userId: "user-1",
          }),
        ];

        const { rerender } = renderWithChakra(
          <MovementsHistory error={null} isLoading={true} transactions={[]} />
        );

        expect(screen.getByTestId("loading-state")).toBeInTheDocument();

        rerender(
          <ChakraProvider value={defaultSystem}>
            <MovementsHistory
              error={null}
              isLoading={false}
              transactions={transactions}
            />
          </ChakraProvider>
        );

        expect(screen.queryByTestId("loading-state")).not.toBeInTheDocument();
        expect(screen.getByTestId("movements-list")).toBeInTheDocument();
      });
    });

    describe("When loading completes with error", () => {
      it("Then should transition from loading to error", () => {
        const { rerender } = renderWithChakra(
          <MovementsHistory error={null} isLoading={true} transactions={[]} />
        );

        expect(screen.getByTestId("loading-state")).toBeInTheDocument();

        rerender(
          <ChakraProvider value={defaultSystem}>
            <MovementsHistory
              error="Network error"
              isLoading={false}
              transactions={[]}
            />
          </ChakraProvider>
        );

        expect(screen.queryByTestId("loading-state")).not.toBeInTheDocument();
        expect(screen.getByTestId("error-state")).toBeInTheDocument();
      });
    });
  });

  describe("Given onRetryLoadTransactions callback", () => {
    describe("When error state is displayed with retry callback", () => {
      it("Then should display retry button", () => {
        const onRetry = vi.fn();

        renderWithChakra(
          <MovementsHistory
            error="Test error"
            isLoading={false}
            onRetryLoadTransactions={onRetry}
            transactions={[]}
          />
        );

        expect(screen.getByTestId("retry-button")).toBeInTheDocument();
      });

      it("Then should call onRetryLoadTransactions when retry button is clicked", async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();

        renderWithChakra(
          <MovementsHistory
            error="Test error"
            isLoading={false}
            onRetryLoadTransactions={onRetry}
            transactions={[]}
          />
        );

        const retryButton = screen.getByTestId("retry-button");
        await user.click(retryButton);

        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });

    describe("When error state is displayed without retry callback", () => {
      it("Then should not display retry button", () => {
        renderWithChakra(
          <MovementsHistory
            error="Test error"
            isLoading={false}
            transactions={[]}
          />
        );

        expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
      });
    });
  });
});
