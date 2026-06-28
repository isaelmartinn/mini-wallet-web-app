import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { PrepareTransferResult } from "#payments/transfer/application/use-cases";
import { Email, Phone } from "#shared/domain/value-objects";

import { TransferSummaryStep } from "./transferSummaryStep";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

const mockContact = Contact.create({
  email: Email.create("juan@example.com"),
  id: "1",
  isFavorite: false,
  name: "Juan Pérez",
  phone: Phone.create("+521234567890"),
});

const mockTransferDraft: PrepareTransferResult = {
  amount: 500,
  recipientId: "1",
  transferId: "transfer-1",
  userId: "user-1",
};

describe("TransferSummaryStep", () => {
  describe("Given a transfer draft with contact and balance", () => {
    describe("When the component renders", () => {
      it("Then should display transfer amount", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        const amounts = screen.getAllByText("$500.00");
        expect(amounts.length).toBeGreaterThan(0);
      });

      it("Then should display contact information", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      });

      it("Then should display resulting balance", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(
          screen.getByText((_content, element) => {
            return (
              element?.textContent === "Saldo actual tras envío: $4,500.00"
            );
          })
        ).toBeInTheDocument();
      });

      it("Then should display commission info", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(screen.getByText(/Comisión/i)).toBeInTheDocument();
        expect(screen.getByText(/Gratis/i)).toBeInTheDocument();
      });

      it("Then should display payment method", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(screen.getByText(/Método de pago/i)).toBeInTheDocument();
        expect(screen.getByText(/Mini Wallet Balance/i)).toBeInTheDocument();
      });

      it("Then should display total amount", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(screen.getByText(/Total a transferir/i)).toBeInTheDocument();
      });

      it("Then should display confirm button", () => {
        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={mockTransferDraft}
          />
        );

        expect(
          screen.getByRole("button", { name: /Confirmar Transferencia/i })
        ).toBeInTheDocument();
      });
    });

    describe("When user clicks confirm button", () => {
      it("Then should call onConfirm callback", async () => {
        const user = userEvent.setup();
        const mockOnConfirm = vi.fn();

        renderWithChakra(
          <TransferSummaryStep
            balance={5000}
            contact={mockContact}
            onConfirm={mockOnConfirm}
            transferDraft={mockTransferDraft}
          />
        );

        const confirmButton = screen.getByRole("button", {
          name: /Confirmar Transferencia/i,
        });
        await user.click(confirmButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given different transfer amounts", () => {
    describe("When rendering with large amount", () => {
      it("Then should format currency correctly", () => {
        const largeDraft: PrepareTransferResult = {
          amount: 10000,
          recipientId: "1",
          transferId: "transfer-1",
          userId: "user-1",
        };

        renderWithChakra(
          <TransferSummaryStep
            balance={15000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={largeDraft}
          />
        );

        const amounts = screen.getAllByText("$10,000.00");
        expect(amounts.length).toBeGreaterThan(0);
        expect(
          screen.getByText((_content, element) => {
            return (
              element?.textContent === "Saldo actual tras envío: $5,000.00"
            );
          })
        ).toBeInTheDocument();
      });
    });

    describe("When rendering with decimal amount", () => {
      it("Then should format decimals correctly", () => {
        const decimalDraft: PrepareTransferResult = {
          amount: 123.45,
          recipientId: "1",
          transferId: "transfer-1",
          userId: "user-1",
        };

        renderWithChakra(
          <TransferSummaryStep
            balance={1000}
            contact={mockContact}
            onConfirm={vi.fn()}
            transferDraft={decimalDraft}
          />
        );

        const amounts = screen.getAllByText("$123.45");
        expect(amounts.length).toBeGreaterThan(0);
        expect(
          screen.getByText((_content, element) => {
            return element?.textContent === "Saldo actual tras envío: $876.55";
          })
        ).toBeInTheDocument();
      });
    });
  });
});
