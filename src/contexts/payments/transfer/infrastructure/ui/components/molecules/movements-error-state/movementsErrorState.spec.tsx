import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MovementsErrorState } from "./movementsErrorState";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsErrorState", () => {
  describe("Given an error message", () => {
    describe("When rendering the component", () => {
      it("Then should display error title", () => {
        renderWithChakra(
          <MovementsErrorState errorMessage="Test error message" />
        );

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Error al cargar movimientos"
        );
      });

      it("Then should display the error message", () => {
        const errorMessage = "Network connection failed";

        renderWithChakra(<MovementsErrorState errorMessage={errorMessage} />);

        expect(screen.getByTestId("error-message")).toHaveTextContent(
          errorMessage
        );
      });

      it("Then should display error state testid", () => {
        renderWithChakra(<MovementsErrorState errorMessage="Test error" />);

        expect(screen.getByTestId("error-state")).toBeInTheDocument();
      });
    });
  });

  describe("Given different error messages", () => {
    describe("When rendering with specific error", () => {
      it("Then should display the specific error message", () => {
        const specificError = "Error al cargar las transacciones";

        renderWithChakra(<MovementsErrorState errorMessage={specificError} />);

        expect(screen.getByTestId("error-message")).toHaveTextContent(
          specificError
        );
      });
    });
  });

  describe("Given onRetry callback is provided", () => {
    describe("When rendering the component", () => {
      it("Then should display retry button", () => {
        const onRetry = vi.fn();

        renderWithChakra(
          <MovementsErrorState errorMessage="Test error" onRetry={onRetry} />
        );

        expect(screen.getByTestId("retry-button")).toBeInTheDocument();
        expect(screen.getByText("Reintentar")).toBeInTheDocument();
      });

      it("Then should call onRetry when button is clicked", async () => {
        const user = userEvent.setup();
        const onRetry = vi.fn();

        renderWithChakra(
          <MovementsErrorState errorMessage="Test error" onRetry={onRetry} />
        );

        const retryButton = screen.getByTestId("retry-button");
        await user.click(retryButton);

        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given onRetry callback is not provided", () => {
    describe("When rendering the component", () => {
      it("Then should not display retry button", () => {
        renderWithChakra(<MovementsErrorState errorMessage="Test error" />);

        expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
      });
    });
  });
});
