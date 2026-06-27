import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReceiptCard } from "./receiptCard";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("ReceiptCard", () => {
  describe("Given receipt card props", () => {
    describe("When rendering with all required data", () => {
      it("Then should display formatted amount", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description="Pago de servicios"
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.getByText("$1,500.50")).toBeInTheDocument();
      });

      it("Then should display transfer ID", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description="Pago de servicios"
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.getByText("TXN-001")).toBeInTheDocument();
      });

      it("Then should display recipient name", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description="Pago de servicios"
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      });

      it("Then should display formatted date", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description="Pago de servicios"
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.getByText("25 de junio, 2024")).toBeInTheDocument();
      });

      it("Then should display description", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description="Pago de servicios"
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.getByText("Pago de servicios")).toBeInTheDocument();
      });
    });

    describe("When rendering without description", () => {
      it("Then should not display description section", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1500.5}
            date="25 de junio, 2024"
            description=""
            recipient="Juan Pérez"
            transferId="TXN-001"
          />
        );

        expect(screen.queryByText("Descripción")).not.toBeInTheDocument();
      });
    });

    describe("When rendering with large amount", () => {
      it("Then should format amount correctly with thousands separator", () => {
        renderWithChakra(
          <ReceiptCard
            amount={1234567.89}
            date="25 de junio, 2024"
            description="Transferencia grande"
            recipient="María García"
            transferId="TXN-002"
          />
        );

        expect(screen.getByText("$1,234,567.89")).toBeInTheDocument();
      });
    });

    describe("When rendering with decimal amount", () => {
      it("Then should display two decimal places", () => {
        renderWithChakra(
          <ReceiptCard
            amount={99.9}
            date="25 de junio, 2024"
            description="Pago pequeño"
            recipient="Carlos López"
            transferId="TXN-003"
          />
        );

        expect(screen.getByText("$99.90")).toBeInTheDocument();
      });
    });
  });
});
