import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovementsEmptyState } from "./movementsEmptyState";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsEmptyState", () => {
  describe("Given no transactions exist", () => {
    describe("When rendering the component", () => {
      it("Then should display empty state title", () => {
        renderWithChakra(<MovementsEmptyState />);

        expect(screen.getByTestId("empty-title")).toHaveTextContent(
          "No hay movimientos"
        );
      });

      it("Then should display empty state description", () => {
        renderWithChakra(<MovementsEmptyState />);

        expect(screen.getByTestId("empty-description")).toHaveTextContent(
          "Aún no tienes transacciones registradas"
        );
      });

      it("Then should display empty state testid", () => {
        renderWithChakra(<MovementsEmptyState />);

        expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      });
    });
  });
});
