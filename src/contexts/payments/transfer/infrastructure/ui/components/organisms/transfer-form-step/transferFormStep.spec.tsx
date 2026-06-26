import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

import { TransferFormStep } from "./transferFormStep";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

const mockContacts: Contact[] = [
  Contact.create({
    email: Email.create("juan@example.com"),
    id: "1",
    isFavorite: false,
    name: "Juan Pérez",
    phone: Phone.create("+521234567890"),
  }),
  Contact.create({
    email: Email.create("maria@example.com"),
    id: "2",
    isFavorite: false,
    name: "María García",
    phone: Phone.create("+529876543210"),
  }),
];

describe("TransferFormStep", () => {
  describe("Given a user with available balance and contacts", () => {
    describe("When the component renders", () => {
      it("Then should display balance information", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
          />
        );

        expect(screen.getByText(/Saldo disponible:/i)).toBeInTheDocument();
        expect(screen.getByText(/\$5,000\.00/i)).toBeInTheDocument();
      });

      it("Then should display amount input", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
          />
        );

        expect(screen.getByText(/Monto/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("$0.00")).toBeInTheDocument();
      });

      it("Then should display contact selector", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
          />
        );

        expect(screen.getByText(/Destinatario/i)).toBeInTheDocument();
      });

      it("Then should display submit button", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
          />
        );

        expect(
          screen.getByRole("button", { name: /Continuar/i })
        ).toBeInTheDocument();
      });
    });

    describe("When user submits valid form", () => {
      it("Then should call onSubmit with form data", async () => {
        const user = userEvent.setup();
        const mockOnSubmit = vi.fn();

        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={mockOnSubmit}
            preselectedContact={mockContacts[0]}
          />
        );

        const amountInput = screen.getByPlaceholderText("$0.00");
        await user.type(amountInput, "100");

        // Trigger blur to ensure the value is processed
        await user.tab();

        const submitButton = screen.getByRole("button", { name: /Continuar/i });
        await user.click(submitButton);

        await waitFor(
          () => {
            expect(mockOnSubmit).toHaveBeenCalled();
          },
          { timeout: 2000 }
        );

        const callArgs = mockOnSubmit.mock.calls[0][0];
        expect(callArgs).toEqual({
          amount: "100",
          recipientId: "1",
        });
      });
    });

    describe("When user submits invalid form", () => {
      it("Then should display validation error for empty amount", async () => {
        const user = userEvent.setup();
        const mockOnSubmit = vi.fn();

        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={mockOnSubmit}
            preselectedContact={mockContacts[0]}
          />
        );

        const submitButton = screen.getByRole("button", { name: /Continuar/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/El monto es requerido/i)
          ).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it("Then should display validation error for missing recipient", async () => {
        const user = userEvent.setup();
        const mockOnSubmit = vi.fn();

        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={mockOnSubmit}
          />
        );

        const amountInput = screen.getByPlaceholderText("$0.00");
        await user.type(amountInput, "100");

        const submitButton = screen.getByRole("button", { name: /Continuar/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(/Debes seleccionar un destinatario/i)
          ).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given loading states", () => {
    describe("When balance is loading", () => {
      it("Then should display skeleton for balance", () => {
        renderWithChakra(
          <TransferFormStep
            balance={null}
            contacts={mockContacts}
            isLoadingBalance={true}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
          />
        );

        const skeletons = document.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });

    describe("When form is submitting", () => {
      it("Then should disable inputs and show loading button", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={true}
            onSubmit={vi.fn()}
          />
        );

        const amountInput = screen.getByPlaceholderText("$0.00");
        expect(amountInput).toBeDisabled();
      });
    });
  });

  describe("Given a preselected contact", () => {
    describe("When the component renders", () => {
      it("Then should set the contact as selected", () => {
        renderWithChakra(
          <TransferFormStep
            balance={5000}
            contacts={mockContacts}
            isLoadingBalance={false}
            isLoadingContacts={false}
            isSubmitting={false}
            onSubmit={vi.fn()}
            preselectedContact={mockContacts[0]}
          />
        );

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      });
    });
  });
});
