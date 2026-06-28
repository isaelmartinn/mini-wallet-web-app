import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovementsLoadingState } from "./movementsLoadingState";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsLoadingState", () => {
  describe("Given the component is rendered", () => {
    describe("When no count prop is provided", () => {
      it("Then should display 3 skeleton items by default", () => {
        const { container } = renderWithChakra(<MovementsLoadingState />);

        const skeletonItems = container.querySelectorAll(
          '[data-testid="loading-state"] > div > div > div'
        );

        expect(skeletonItems).toHaveLength(3);
      });

      it("Then should display loading state testid", () => {
        renderWithChakra(<MovementsLoadingState />);

        expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      });
    });

    describe("When count prop is 5", () => {
      it("Then should display 5 skeleton items", () => {
        const { container } = renderWithChakra(
          <MovementsLoadingState count={5} />
        );

        const skeletonItems = container.querySelectorAll(
          '[data-testid="loading-state"] > div > div > div'
        );

        expect(skeletonItems).toHaveLength(5);
      });
    });

    describe("When count prop is 1", () => {
      it("Then should display 1 skeleton item", () => {
        const { container } = renderWithChakra(
          <MovementsLoadingState count={1} />
        );

        const skeletonItems = container.querySelectorAll(
          '[data-testid="loading-state"] > div > div > div'
        );

        expect(skeletonItems).toHaveLength(1);
      });
    });
  });
});
