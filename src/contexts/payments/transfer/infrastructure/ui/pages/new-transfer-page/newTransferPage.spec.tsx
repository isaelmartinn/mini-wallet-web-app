/**
 * @vitest-environment jsdom
 */

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Contact } from "#payments/contact/domain/entities";
import { AuthStore } from "#shared/domain/interfaces";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";
import { Email, Phone } from "#shared/domain/value-objects";

import { NewTransferPage } from "./newTransferPage";

const mockAuthStore = vi.fn() as unknown as AuthStore<{
  getId: () => string;
}>;

const mockBalanceProvider: BalanceProvider = {
  getAvailableBalance: vi.fn().mockResolvedValue(5000),
};

vi.mock("#shared/infrastructure/hooks", () => ({
  useAuthContext: () => ({
    user: {
      getId: () => "user-123",
    },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
    toString: vi.fn().mockReturnValue(""),
  }),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <div>ArrowLeft Icon</div>,
  Send: () => <div>Send Icon</div>,
  Star: () => <div>Star Icon</div>,
  User: () => <div>User Icon</div>,
  UserPlus: () => <div>UserPlus Icon</div>,
}));

vi.mock("#payments/transfer/infrastructure/repositories", () => ({
  ContactRepositoryMock: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([
      {
        getEmail: vi.fn().mockReturnValue({
          getValue: vi.fn().mockReturnValue("contact1@test.com"),
        } as unknown as Email),
        getId: vi.fn().mockReturnValue("contact-1"),
        getName: vi.fn().mockReturnValue("Contact 1"),
        getPhone: vi.fn().mockReturnValue({
          getValue: vi.fn().mockReturnValue("+525512345678"),
        } as unknown as Phone),
        isFavorite: vi.fn().mockReturnValue(false),
      } as unknown as Contact,
    ]),
  })),
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("NewTransferPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given the page is rendered", () => {
    describe("When the component loads", () => {
      it("Then should display the page title", () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        expect(screen.getByText("Nueva Transferencia")).toBeInTheDocument();
      });

      it("Then should display amount input field", () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        expect(screen.getByText("Monto")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("$0.00")).toBeInTheDocument();
      });

      it("Then should display recipient selector", () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        expect(screen.getByText("Destinatario")).toBeInTheDocument();
      });

      it("Then should display continue button", () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        expect(
          screen.getByRole("button", { name: /continuar/i })
        ).toBeInTheDocument();
      });
    });

    describe("When balance is loading", () => {
      it("Then should display skeleton loader", async () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        const skeletons = document.querySelectorAll(".chakra-skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });

    describe("When balance is loaded", () => {
      it("Then should display available balance", async () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        await waitFor(() => {
          expect(screen.getByText(/saldo disponible/i)).toBeInTheDocument();
        });
      });
    });

    describe("When contacts are loading or empty", () => {
      it("Then should display contact selector section", async () => {
        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        await waitFor(() => {
          expect(screen.getByText("Destinatario")).toBeInTheDocument();
        });
      });
    });

    describe("When user submits form without selecting recipient", () => {
      it("Then should display validation error", async () => {
        const user = userEvent.setup();

        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        const continueButton = screen.getByRole("button", {
          name: /continuar/i,
        });
        await user.click(continueButton);

        await waitFor(() => {
          expect(
            screen.getByText(/debes seleccionar un destinatario/i)
          ).toBeInTheDocument();
        });
      });
    });

    describe("When user submits form without amount", () => {
      it("Then should display validation error", async () => {
        const user = userEvent.setup();

        renderWithChakra(
          <NewTransferPage
            authStore={mockAuthStore}
            balanceProvider={mockBalanceProvider}
          />
        );

        const continueButton = screen.getByRole("button", {
          name: /continuar/i,
        });
        await user.click(continueButton);

        await waitFor(() => {
          expect(
            screen.getByText(/el monto es requerido/i)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
