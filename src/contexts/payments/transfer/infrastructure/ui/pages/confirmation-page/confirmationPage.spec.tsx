import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { useWalletStore } from "#wallet/infrastructure/store";

import { ConfirmationPage } from "./confirmationPage";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("#auth/session/infrastructure/store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("#wallet/infrastructure/store", () => ({
  useWalletStore: vi.fn(),
}));

vi.mock("#shared/infrastructure/ui/hooks", () => ({
  useErrorHandler: vi.fn(),
}));

vi.mock("#payments/transfer/infrastructure/repositories", () => ({
  TransferRepositoryImpl: vi.fn(),
}));

vi.mock("#payments/transfer/infrastructure/ui/components", () => ({
  ConfirmationLoadingState: () => (
    <div data-testid="loading-state">Loading</div>
  ),
  ConfirmationSuccessState: ({
    amount,
    recipientName,
    transferId,
  }: {
    amount: number;
    recipientName: string;
    transferId: string;
  }) => (
    <div data-testid="success-state">
      <div>{amount}</div>
      <div>{recipientName}</div>
      <div>{transferId}</div>
    </div>
  ),
}));

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
}

describe("ConfirmationPage", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockSearchParams = {
    get: vi.fn(),
  };

  const mockUser = {
    getId: () => "user-123",
  };

  const mockHandleError = vi.fn();
  const mockSetBalance = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSearchParams
    );
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUser
    );
    (useWalletStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setBalance: mockSetBalance,
    });
    (useErrorHandler as ReturnType<typeof vi.fn>).mockReturnValue({
      handleError: mockHandleError,
    });
  });

  describe("Given no transferId in URL", () => {
    describe("When the page loads", () => {
      it("Then should redirect to home", () => {
        mockSearchParams.get.mockReturnValue(null);

        renderWithChakra(<ConfirmationPage />);

        expect(mockRouter.push).toHaveBeenCalledWith("/home");
      });
    });
  });

  describe("Given no authenticated user", () => {
    describe("When the page loads", () => {
      it("Then should redirect to home", () => {
        mockSearchParams.get.mockReturnValue("TRX-123");
        (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
          null
        );

        renderWithChakra(<ConfirmationPage />);

        expect(mockRouter.push).toHaveBeenCalledWith("/home");
      });
    });
  });

  describe("Given a valid transferId and authenticated user", () => {
    describe("When transfer confirmation fails", () => {
      it("Then should navigate to error page", async () => {
        mockSearchParams.get.mockReturnValue("TRX-123");

        const mockTransferRepo = {
          findById: vi.fn().mockRejectedValue(new Error("Network error")),
        };

        (
          TransferRepositoryImpl as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => mockTransferRepo);

        renderWithChakra(<ConfirmationPage />);

        await waitFor(() => {
          expect(mockRouter.push).toHaveBeenCalledWith(
            expect.stringContaining("/transactions/error?type=")
          );
        });

        expect(mockHandleError).toHaveBeenCalled();
      });
    });
  });
});
