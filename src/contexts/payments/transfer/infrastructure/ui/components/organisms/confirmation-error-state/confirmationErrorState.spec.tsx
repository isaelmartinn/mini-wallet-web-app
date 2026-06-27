import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationErrorState } from "./confirmationErrorState";

vi.mock("#shared/infrastructure/ui/hooks", () => ({
  useThemeToken: vi.fn(() => "#e53e3e"),
}));

describe("ConfirmationErrorState", () => {
  describe("Given the component is rendered", () => {
    describe("When the component loads", () => {
      it("Then should display error message and title", () => {
        const mockOnRetry = vi.fn();
        const mockOnGoHome = vi.fn();

        render(
          <ConfirmationErrorState
            onGoHome={mockOnGoHome}
            onRetry={mockOnRetry}
          />
        );

        expect(
          screen.getByText("Error en la transferencia")
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Ocurrió un error al procesar tu transferencia. Por favor, intenta nuevamente."
          )
        ).toBeInTheDocument();
      });

      it("Then should display retry and go home buttons", () => {
        const mockOnRetry = vi.fn();
        const mockOnGoHome = vi.fn();

        render(
          <ConfirmationErrorState
            onGoHome={mockOnGoHome}
            onRetry={mockOnRetry}
          />
        );

        expect(
          screen.getByRole("button", { name: /reintentar/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /volver al inicio/i })
        ).toBeInTheDocument();
      });
    });

    describe("When user clicks retry button", () => {
      it("Then should call onRetry callback", async () => {
        const user = userEvent.setup();
        const mockOnRetry = vi.fn();
        const mockOnGoHome = vi.fn();

        render(
          <ConfirmationErrorState
            onGoHome={mockOnGoHome}
            onRetry={mockOnRetry}
          />
        );

        const retryButton = screen.getByRole("button", { name: /reintentar/i });
        await user.click(retryButton);

        expect(mockOnRetry).toHaveBeenCalledTimes(1);
      });
    });

    describe("When user clicks go home button", () => {
      it("Then should call onGoHome callback", async () => {
        const user = userEvent.setup();
        const mockOnRetry = vi.fn();
        const mockOnGoHome = vi.fn();

        render(
          <ConfirmationErrorState
            onGoHome={mockOnGoHome}
            onRetry={mockOnRetry}
          />
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
