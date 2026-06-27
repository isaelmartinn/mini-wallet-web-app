import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfirmationLoadingState } from "./confirmationLoadingState";

describe("ConfirmationLoadingState", () => {
  describe("Given the component is rendered", () => {
    describe("When no custom message is provided", () => {
      it("Then should display default loading message", () => {
        render(<ConfirmationLoadingState />);

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
        const { container } = render(<ConfirmationLoadingState />);

        const spinner = container.querySelector(".chakra-spinner");
        expect(spinner).toBeInTheDocument();
      });
    });

    describe("When a custom message is provided", () => {
      it("Then should display the custom message", () => {
        const customMessage = "Procesando tu solicitud...";
        render(<ConfirmationLoadingState message={customMessage} />);

        expect(screen.getByText(customMessage)).toBeInTheDocument();
      });
    });
  });
});
