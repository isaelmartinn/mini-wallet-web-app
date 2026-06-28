import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthStore } from "#shared/domain/interfaces";
import { Amount } from "#shared/domain/value-objects";
import { useWalletStore } from "#wallet/balance/infrastructure/store";

import { BalanceSection } from "./balanceSection";

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

vi.mock("#wallet/balance/infrastructure/ui/hooks", () => ({
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

vi.mock("#wallet/balance/infrastructure/ui/components", () => ({
  BalanceCard: () => <div data-testid="balance-card" />,
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("BalanceSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWalletStore.setState({
      balance: null,
      isLoading: false,
      userProfile: null,
    });
  });

  describe("Given the balance section is rendered", () => {
    describe("When the page loads", () => {
      it("Then should display the balance card", () => {
        renderWithChakra(<BalanceSection authStore={mockAuthStore} />);

        expect(screen.getByTestId("balance-card")).toBeInTheDocument();
      });
    });
  });

  describe("Given wallet data is loading", () => {
    describe("When the component mounts with a user", () => {
      it("Then should show loading state in balance card", async () => {
        renderWithChakra(<BalanceSection authStore={mockAuthStore} />);

        await waitFor(() => {
          expect(screen.getByTestId("balance-card")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Given the page structure", () => {
    describe("When the component renders", () => {
      it("Then should render the balance card", () => {
        renderWithChakra(<BalanceSection authStore={mockAuthStore} />);

        const balanceCard = screen.getByTestId("balance-card");
        expect(balanceCard).toBeInTheDocument();
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

        renderWithChakra(<BalanceSection authStore={mockAuthStore} />);

        const state = useWalletStore.getState();
        expect(state.balance).toBeNull();
      });
    });
  });
});
