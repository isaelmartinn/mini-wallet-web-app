import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TransferErrorPage } from "./transferErrorPage";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("TransferErrorPage", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      back: mockBack,
      push: mockPush,
    });
  });

  describe("Given INSUFFICIENT_FUNDS error type", () => {
    describe("When rendering the page", () => {
      it("Then should display insufficient funds error message", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("INSUFFICIENT_FUNDS"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Saldo insuficiente"
        );
        expect(screen.getByTestId("error-description")).toHaveTextContent(
          "No tienes saldo suficiente para completar esta transferencia"
        );
      });

      it("Then should not show retry button", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("INSUFFICIENT_FUNDS"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
        expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
      });
    });
  });

  describe("Given NETWORK_ERROR error type", () => {
    describe("When rendering the page", () => {
      it("Then should display network error message", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("NETWORK_ERROR"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Error de conexión"
        );
      });

      it("Then should show both retry and go home buttons", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("NETWORK_ERROR"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("retry-button")).toBeInTheDocument();
        expect(screen.getByTestId("go-home-button")).toBeInTheDocument();
      });
    });

    describe("When clicking retry button", () => {
      it("Then should navigate back", async () => {
        const user = userEvent.setup();
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("NETWORK_ERROR"),
        });

        renderWithChakra(<TransferErrorPage />);

        await user.click(screen.getByTestId("retry-button"));

        expect(mockBack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given TIMEOUT error type", () => {
    describe("When rendering the page", () => {
      it("Then should display timeout error message", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("TIMEOUT"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Tiempo de espera agotado"
        );
      });

      it("Then should not show retry button", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("TIMEOUT"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
      });
    });
  });

  describe("Given UNKNOWN_ERROR error type", () => {
    describe("When rendering the page", () => {
      it("Then should display unknown error message", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("UNKNOWN_ERROR"),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Error inesperado"
        );
      });
    });
  });

  describe("Given no error type in query params", () => {
    describe("When rendering the page", () => {
      it("Then should default to UNKNOWN_ERROR", () => {
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue(null),
        });

        renderWithChakra(<TransferErrorPage />);

        expect(screen.getByTestId("error-title")).toHaveTextContent(
          "Error inesperado"
        );
      });
    });
  });

  describe("Given any error type", () => {
    describe("When clicking go home button", () => {
      it("Then should navigate to home", async () => {
        const user = userEvent.setup();
        (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue({
          get: vi.fn().mockReturnValue("INSUFFICIENT_FUNDS"),
        });

        renderWithChakra(<TransferErrorPage />);

        await user.click(screen.getByTestId("go-home-button"));

        expect(mockPush).toHaveBeenCalledWith("/home");
      });
    });
  });
});
