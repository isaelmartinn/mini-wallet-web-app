import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "#auth/session/infrastructure";

import { LoginPage } from "./loginPage";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("sileo", () => ({
  sileo: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("lucide-react", () => ({
  LogIn: () => <div data-testid="login-icon">LogIn Icon</div>,
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  });

  describe("Given the login page is rendered", () => {
    describe("When the page loads", () => {
      it("Then should display the login form", () => {
        renderWithChakra(<LoginPage />);

        expect(
          screen.getByRole("heading", { name: /iniciar sesión/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText("Ingresa tu email o teléfono para continuar")
        ).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("ejemplo@email.com o +521234567890")
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /iniciar sesión/i })
        ).toBeInTheDocument();
      });

      it("Then should display test users hint", () => {
        renderWithChakra(<LoginPage />);

        expect(screen.getByText(/Usuarios de prueba/)).toBeInTheDocument();
      });
    });
  });

  describe("Given a user enters credentials", () => {
    describe("When the user enters a valid email", () => {
      it("Then should enable the submit button", async () => {
        const user = userEvent.setup();
        renderWithChakra(<LoginPage />);

        const input = screen.getByPlaceholderText(
          "ejemplo@email.com o +521234567890"
        );
        await user.type(input, "test@example.com");

        const submitButton = screen.getByRole("button", {
          name: /iniciar sesión/i,
        });
        expect(submitButton).not.toBeDisabled();
      });
    });

    describe("When the user enters a valid phone", () => {
      it("Then should enable the submit button", async () => {
        const user = userEvent.setup();
        renderWithChakra(<LoginPage />);

        const input = screen.getByPlaceholderText(
          "ejemplo@email.com o +521234567890"
        );
        await user.type(input, "+521234567890");

        const submitButton = screen.getByRole("button", {
          name: /iniciar sesión/i,
        });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe("Given form validation", () => {
    describe("When the user submits an empty form", () => {
      it("Then should display validation error", async () => {
        const user = userEvent.setup();
        renderWithChakra(<LoginPage />);

        const submitButton = screen.getByRole("button", {
          name: /iniciar sesión/i,
        });
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText("Este campo es requerido")
          ).toBeInTheDocument();
        });
      });
    });
  });
});
