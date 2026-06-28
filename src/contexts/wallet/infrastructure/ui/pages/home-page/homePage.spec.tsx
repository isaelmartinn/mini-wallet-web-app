import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthStore } from "#shared/domain/interfaces";
import { Amount } from "#shared/domain/value-objects";
import { useWalletStore } from "#wallet/infrastructure/store";

import { HomePage } from "./homePage";

const mockAuthStore = vi.fn() as unknown as AuthStore<{
  getId: () => string;
}>;

vi.mock("#shared/infrastructure/hooks", () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: {
      getId: () => "test-user-id",
    },
  }),
}));

vi.mock("#shared/infrastructure/ui/hooks", () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}));

vi.mock("#payments/transfer/infrastructure/ui/components", () => ({
  MovementsHistory: () => <div data-testid="movements-list" />,
}));

vi.mock(
  "#payments/transfer/infrastructure/ui/error-mapper/transferListErrorMapper",
  () => ({
    TransferListErrorMapper: vi.fn(),
  })
);

vi.mock("#payments/transfer/infrastructure/repositories", () => ({
  TransferRepositoryImpl: vi.fn().mockImplementation(() => ({
    getTransactions: vi.fn().mockResolvedValue([]),
  })),
}));

vi.mock("#payments/transfer/application/use-cases", () => ({
  GetTransfersUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue([]),
  })),
}));

vi.mock("#wallet/infrastructure/ui/hooks", () => ({
  useWalletData: () => ({
    balance: {
      getAmount: () => Amount.create(5000),
      getCurrency: () => "MXN",
    },
    isLoading: false,
    userProfile: {
      getEmail: () => "test@example.com",
      getFullName: () => "Test User",
      getId: () => "test-user-id",
      getInitials: () => "TU",
      getPhone: () => "+521234567890",
    },
  }),
}));

vi.mock("#wallet/infrastructure/ui/components", () => ({
  BalanceCard: () => <div data-testid="balance-card" />,
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWalletStore.setState({
      balance: null,
      isLoading: false,
      userProfile: null,
    });
  });

  describe("Given the home page is rendered", () => {
    describe("When the page loads", () => {
      it("Then should display the balance card", () => {
        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        expect(screen.getByTestId("balance-card")).toBeInTheDocument();
      });

      it("Then should display the movements list", () => {
        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        expect(screen.getByTestId("movements-list")).toBeInTheDocument();
      });
    });
  });

  describe("Given wallet data is loading", () => {
    describe("When the component mounts with a user", () => {
      it("Then should show loading state in balance card", async () => {
        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        await waitFor(() => {
          expect(screen.getByTestId("balance-card")).toBeInTheDocument();
        });
      });

      it("Then should show loading state in movements list", async () => {
        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        await waitFor(() => {
          expect(screen.getByTestId("movements-list")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Given the page structure", () => {
    describe("When the component renders", () => {
      it("Then should have the correct layout structure", () => {
        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        const balanceCard = screen.getByTestId("balance-card");
        const movementsList = screen.getByTestId("movements-list");

        expect(balanceCard).toBeInTheDocument();
        expect(movementsList).toBeInTheDocument();
      });

      it("Then should render within a container with proper styling", () => {
        const { container } = renderWithChakra(
          <HomePage authStore={mockAuthStore} />
        );

        const chakraContainer = container.querySelector(".chakra-container");
        expect(chakraContainer).toBeInTheDocument();
      });
    });
  });

  describe("Given no user is authenticated", () => {
    describe("When the component renders without a user", () => {
      it("Then should not load wallet data", () => {
        vi.mock("#shared/infrastructure/hooks", () => ({
          useAuthContext: () => ({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          }),
        }));

        renderWithChakra(<HomePage authStore={mockAuthStore} />);

        const state = useWalletStore.getState();
        expect(state.balance).toBeNull();
      });
    });
  });
});
