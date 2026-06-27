import { render, screen, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "#auth/infrastructure/store";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import { ConfirmTransferUseCase } from "#payments/transfer/application/use-cases";
import { Transfer } from "#payments/transfer/domain/entities";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { WalletRepository } from "#wallet/infrastructure/repositories";
import { useWalletStore } from "#wallet/infrastructure/store";

import { ConfirmationPage } from "./confirmationPage";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("#auth/infrastructure/store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("#wallet/infrastructure/store", () => ({
  useWalletStore: vi.fn(),
}));

vi.mock("#shared/infrastructure/ui/hooks", () => ({
  useErrorHandler: vi.fn(),
}));

vi.mock("#payments/contact/infrastructure/repositories", () => ({
  ContactRepository: vi.fn(),
}));

vi.mock("#payments/transfer/infrastructure/repositories", () => ({
  TransferRepositoryImpl: vi.fn(),
}));

vi.mock("#wallet/infrastructure/repositories", () => ({
  WalletRepository: {
    getInstance: vi.fn(),
  },
}));

vi.mock("#payments/transfer/application/use-cases", () => ({
  ConfirmTransferUseCase: vi.fn(),
}));

vi.mock("#payments/transfer/infrastructure/ui/components", () => ({
  ConfirmationErrorState: ({
    onGoHome,
    onRetry,
  }: {
    onGoHome: () => void;
    onRetry: () => void;
  }) => (
    <div data-testid="error-state">
      <button onClick={onRetry}>Retry</button>
      <button onClick={onGoHome}>Go Home</button>
    </div>
  ),
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

        render(<ConfirmationPage />);

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

        render(<ConfirmationPage />);

        expect(mockRouter.push).toHaveBeenCalledWith("/home");
      });
    });
  });

  describe("Given a valid transferId and authenticated user", () => {
    describe("When the page loads", () => {
      it("Then should display loading state initially", () => {
        mockSearchParams.get.mockReturnValue("TRX-123");

        render(<ConfirmationPage />);

        expect(screen.getByTestId("loading-state")).toBeInTheDocument();
      });
    });

    describe("When transfer confirmation fails", () => {
      it("Then should display error state", async () => {
        mockSearchParams.get.mockReturnValue("TRX-123");

        const mockTransferRepo = {
          findById: vi.fn().mockRejectedValue(new Error("Network error")),
        };

        (
          TransferRepositoryImpl as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => mockTransferRepo);

        render(<ConfirmationPage />);

        await waitFor(() => {
          expect(screen.getByTestId("error-state")).toBeInTheDocument();
        });

        expect(mockHandleError).toHaveBeenCalled();
      });
    });

    describe("When transfer confirmation succeeds", () => {
      it("Then should display success state with transfer details", async () => {
        mockSearchParams.get.mockReturnValue("TRX-123");

        const mockTransfer = {
          getAmount: () => ({ getValue: () => 1000 }),
          getDate: () => ({ getValue: () => new Date("2024-01-01") }),
          getDescription: () => "Test transfer",
          getId: () => "TRX-123",
          getRecipientId: () => "recipient-123",
        } as unknown as Transfer;

        const mockContact = {
          getName: () => "Juan Pérez",
        };

        const mockTransferRepo = {
          findById: vi.fn().mockResolvedValue(mockTransfer),
        };

        const mockContactRepo = {
          findById: vi.fn().mockResolvedValue(mockContact),
        };

        const mockWalletRepo = {
          getBalance: vi.fn().mockResolvedValue(5000),
        };

        const mockConfirmUseCase = {
          execute: vi.fn().mockResolvedValue(mockTransfer),
        };

        (
          TransferRepositoryImpl as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => mockTransferRepo);
        (
          ContactRepository as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => mockContactRepo);
        (
          WalletRepository.getInstance as ReturnType<typeof vi.fn>
        ).mockReturnValue(mockWalletRepo);
        (
          ConfirmTransferUseCase as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => mockConfirmUseCase);

        render(<ConfirmationPage />);

        await waitFor(() => {
          expect(screen.getByTestId("success-state")).toBeInTheDocument();
        });

        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
        expect(screen.getByText("TRX-123")).toBeInTheDocument();
      });
    });
  });
});
