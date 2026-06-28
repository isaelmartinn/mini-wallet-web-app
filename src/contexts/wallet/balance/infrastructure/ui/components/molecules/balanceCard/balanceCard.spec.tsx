import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Amount } from "#shared/domain/value-objects";

import { BalanceCard } from "./balanceCard";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

const mockBalance = {
  getAmount: () => Amount.create(5000),
  getCurrency: () => "MXN",
};

describe("BalanceCard", () => {
  describe("Given a loading state", () => {
    describe("When the component is rendered", () => {
      it("Then should display skeleton loaders", () => {
        const { container } = renderWithChakra(
          <BalanceCard balance={null} isLoading={true} />
        );

        const skeletons = container.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Given no balance is provided", () => {
    describe("When the component is rendered", () => {
      it("Then should display skeleton loaders", () => {
        const { container } = renderWithChakra(<BalanceCard balance={null} />);

        const skeletons = container.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Given a valid balance", () => {
    describe("When the component is rendered", () => {
      it("Then should display formatted balance", () => {
        renderWithChakra(<BalanceCard balance={mockBalance as never} />);

        expect(screen.getByText("Saldo disponible")).toBeInTheDocument();
        expect(screen.getByText("$5,000.00")).toBeInTheDocument();
      });
    });

    describe("When the user clicks the visibility toggle", () => {
      it("Then should hide the balance", async () => {
        const user = userEvent.setup();
        renderWithChakra(<BalanceCard balance={mockBalance as never} />);

        const toggleButton = screen.getByRole("button", {
          name: /ocultar saldo/i,
        });
        await user.click(toggleButton);

        expect(screen.getByText("••••••")).toBeInTheDocument();
        expect(screen.queryByText("$5,000.00")).not.toBeInTheDocument();
      });

      it("Then should show the balance again when clicked twice", async () => {
        const user = userEvent.setup();
        renderWithChakra(<BalanceCard balance={mockBalance as never} />);

        const toggleButton = screen.getByRole("button", {
          name: /ocultar saldo/i,
        });
        await user.click(toggleButton);
        await user.click(
          screen.getByRole("button", { name: /mostrar saldo/i })
        );

        expect(screen.getByText("$5,000.00")).toBeInTheDocument();
      });
    });
  });
});
