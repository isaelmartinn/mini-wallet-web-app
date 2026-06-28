import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationSuccessState } from "./confirmationSuccessState";

vi.mock("#shared/infrastructure/ui/hooks", () => ({
  useThemeToken: vi.fn(() => "#38a169"),
}));

vi.mock("#payments/transfer/infrastructure/ui/components", () => ({
  ReceiptCard: ({
    amount,
    date,
    description,
    recipient,
    transferId,
  }: {
    amount: number;
    date: string;
    description: string;
    recipient: string;
    transferId: string;
  }) => (
    <div data-testid="receipt-card">
      <div>{amount}</div>
      <div>{date}</div>
      <div>{description}</div>
      <div>{recipient}</div>
      <div>{transferId}</div>
    </div>
  ),
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("ConfirmationSuccessState", () => {
  const defaultProps = {
    amount: 1000,
    date: "1 de enero de 2024",
    description: "Pago de servicios",
    onGoHome: vi.fn(),
    recipientName: "Juan Pérez",
    transferId: "TRX-123456",
  };

  describe("Given the component is rendered", () => {
    describe("When the component loads", () => {
      it("Then should display success title", () => {
        renderWithChakra(<ConfirmationSuccessState {...defaultProps} />);

        expect(screen.getByText("Transferencia exitosa")).toBeInTheDocument();
      });

      it("Then should display receipt card with transfer details", () => {
        renderWithChakra(<ConfirmationSuccessState {...defaultProps} />);

        const receiptCard = screen.getByTestId("receipt-card");
        expect(receiptCard).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(screen.getByText("1 de enero de 2024")).toBeInTheDocument();
        expect(screen.getByText("Pago de servicios")).toBeInTheDocument();
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
        expect(screen.getByText("TRX-123456")).toBeInTheDocument();
      });

      it("Then should display go home button", () => {
        renderWithChakra(<ConfirmationSuccessState {...defaultProps} />);

        expect(
          screen.getByRole("button", { name: /volver al inicio/i })
        ).toBeInTheDocument();
      });
    });

    describe("When user clicks go home button", () => {
      it("Then should call onGoHome callback", async () => {
        const user = userEvent.setup();
        const mockOnGoHome = vi.fn();

        renderWithChakra(
          <ConfirmationSuccessState {...defaultProps} onGoHome={mockOnGoHome} />
        );

        const goHomeButton = screen.getByRole("button", {
          name: /volver al inicio/i,
        });
        await user.click(goHomeButton);

        expect(mockOnGoHome).toHaveBeenCalledTimes(1);
      });
    });
  });
});
