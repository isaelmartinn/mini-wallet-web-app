"use client";

import { useEffect, useMemo, useState } from "react";

import { GetTransfersUseCase } from "#payments/transfer/application/use-cases";
import { Transfer } from "#payments/transfer/domain/entities";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import { MovementsHistory } from "#payments/transfer/infrastructure/ui/components";
import { TransferListErrorMapper } from "#payments/transfer/infrastructure/ui/error-mapper/transferListErrorMapper";
import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";

interface MovementsSectionProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function MovementsSection<TUser extends UserWithId>({
  authStore,
}: MovementsSectionProps<TUser>) {
  const { user } = useAuthContext(authStore);

  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState<null | string>(
    null
  );
  const errorMappers = useMemo(() => [new TransferListErrorMapper()], []);
  const { handleError } = useErrorHandler(errorMappers);

  const handleRetryLoadTransactions = () => {
    if (!user) return;

    const loadData = async () => {
      setIsLoadingTransactions(true);
      setTransactionsError(null);

      try {
        const transferRepository = new TransferRepositoryImpl();
        const getTransfersUseCase = new GetTransfersUseCase(transferRepository);

        const transfersData = await getTransfersUseCase.execute({
          userId: user.getId(),
        });
        setTransactions(transfersData);
      } catch (error) {
        handleError(error);
        setTransactionsError(
          "No se pudieron cargar las transacciones. Por favor, intenta nuevamente."
        );
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    loadData();
  };

  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      setIsLoadingTransactions(true);
      setTransactionsError(null);

      try {
        const transferRepository = new TransferRepositoryImpl();
        const getTransfersUseCase = new GetTransfersUseCase(transferRepository);

        const transfersData = await getTransfersUseCase.execute({
          userId: user.getId(),
        });
        setTransactions(transfersData);
      } catch (error) {
        handleError(error);
        setTransactionsError(
          "No se pudieron cargar las transacciones. Por favor, intenta nuevamente."
        );
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [user, handleError]);

  return (
    <MovementsHistory
      error={transactionsError}
      isLoading={isLoadingTransactions}
      onRetryLoadTransactions={handleRetryLoadTransactions}
      transactions={transactions}
    />
  );
}
