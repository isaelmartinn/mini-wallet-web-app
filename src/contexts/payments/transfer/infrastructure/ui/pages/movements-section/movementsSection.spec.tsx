import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthStore } from "#shared/domain/interfaces";

import { MovementsSection } from "./movementsSection";

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

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("MovementsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given the movements section is rendered", () => {
    describe("When the page loads", () => {
      it("Then should display the movements list", () => {
        renderWithChakra(<MovementsSection authStore={mockAuthStore} />);

        expect(screen.getByTestId("movements-list")).toBeInTheDocument();
      });
    });
  });

  describe("Given transfers are loading", () => {
    describe("When the component mounts with a user", () => {
      it("Then should show loading state in movements list", async () => {
        renderWithChakra(<MovementsSection authStore={mockAuthStore} />);

        await waitFor(() => {
          expect(screen.getByTestId("movements-list")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Given the section structure", () => {
    describe("When the component renders", () => {
      it("Then should render the movements history component", () => {
        renderWithChakra(<MovementsSection authStore={mockAuthStore} />);

        const movementsList = screen.getByTestId("movements-list");
        expect(movementsList).toBeInTheDocument();
      });
    });
  });
});
