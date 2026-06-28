import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfirmationLoadingState } from "./confirmationLoadingState";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("ConfirmationLoadingState", () => {
  describe("Given the component is rendered", () => {
    describe("When no custom message is provided", () => {
      it("Then should display default loading message", () => {
        renderWithChakra(<ConfirmationLoadingState />);

        expect(
          screen.getByText("Procesando transferencia")
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Por favor espera mientras confirmamos tu transferencia..."
          )
        ).toBeInTheDocument();
      });

      it("Then should display loading spinner", () => {
        const { container } = renderWithChakra(<ConfirmationLoadingState />);

        const spinner = container.querySelector(".chakra-spinner");
        expect(spinner).toBeInTheDocument();
      });
    });

    describe("When a custom message is provided", () => {
      it("Then should display the custom message", () => {
        const customMessage = "Procesando tu solicitud...";
        renderWithChakra(<ConfirmationLoadingState message={customMessage} />);

        expect(screen.getByText(customMessage)).toBeInTheDocument();
      });
    });
  });
});
