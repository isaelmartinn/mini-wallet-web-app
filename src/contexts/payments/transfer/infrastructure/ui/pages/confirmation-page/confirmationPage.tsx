"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import { ConfirmTransferUseCase } from "#payments/transfer/application/use-cases";
import { Transfer } from "#payments/transfer/domain/entities";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import {
  ConfirmationLoadingState,
  ConfirmationSuccessState,
} from "#payments/transfer/infrastructure/ui/components";
import { TransferConfirmErrorMapper } from "#payments/transfer/infrastructure/ui/error-mapper/transferConfirmErrorMapper";
import { mapDomainErrorToType } from "#payments/transfer/infrastructure/ui/utils/errorTypeMapper";
import { BalanceProvider } from "#shared/domain/interfaces";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { BalanceProviderAdapter, WalletRepository } from "#wallet/balance";

type ConfirmationState = "loading" | "success";

export function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleError } = useErrorHandler([new TransferConfirmErrorMapper()]);
  const user = useAuthStore((state) => state.user);

  const [state, setState] = useState<ConfirmationState>("loading");
  const [transfer, setTransfer] = useState<null | Transfer>(null);
  const [recipientName, setRecipientName] = useState<string>("Destinatario");
  const hasConfirmedRef = useRef(false);
  const isConfirmingRef = useRef(false);

  const transferId = searchParams.get("transferId");

  const confirmTransferFlow = useCallback(async () => {
    if (!transferId || !user) {
      router.push("/home");
      return;
    }

    if (isConfirmingRef.current) {
      return;
    }

    isConfirmingRef.current = true;
    setState("loading");

    try {
      const transferRepository = new TransferRepositoryImpl();
      const walletRepository = WalletRepository.getInstance();
      const balanceProvider: BalanceProvider = new BalanceProviderAdapter(
        walletRepository
      );
      const contactRepository = new ContactRepository();

      const foundTransfer = await transferRepository.findById(transferId);

      if (!foundTransfer) {
        router.push("/home");
        return;
      }

      const contact = await contactRepository.findById(
        foundTransfer.getRecipientId()
      );
      if (contact) {
        setRecipientName(contact.getName());
      }

      const confirmUseCase = new ConfirmTransferUseCase(
        transferRepository,
        balanceProvider
      );

      const confirmedTransfer = await confirmUseCase.execute({
        amount: foundTransfer.getAmount().getValue(),
        transferId,
        userId: user.getId(),
      });

      setTransfer(confirmedTransfer);
      setState("success");
    } catch (error) {
      handleError(error);
      const errorType = mapDomainErrorToType(error);
      router.push(`/transactions/error?type=${errorType}`);
    } finally {
      isConfirmingRef.current = false;
    }
  }, [transferId, user, router, handleError]);

  useEffect(() => {
    if (hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;

    confirmTransferFlow();
  }, [confirmTransferFlow]);

  const handleGoHome = () => {
    router.push("/home");
  };

  if (state === "loading") {
    return <ConfirmationLoadingState />;
  }

  if (state === "success" && transfer) {
    return (
      <ConfirmationSuccessState
        amount={transfer.getAmount().getValue()}
        date={transfer.getDate().getValue().toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        description={transfer.getDescription()}
        onGoHome={handleGoHome}
        recipientName={recipientName}
        transferId={transfer.getId()}
      />
    );
  }

  return null;
}
