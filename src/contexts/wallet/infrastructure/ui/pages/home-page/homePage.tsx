"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GetTransfersUseCase } from "#payments/transfer/application/use-cases";
import { Transfer } from "#payments/transfer/domain/entities";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import { MovementsList } from "#payments/transfer/infrastructure/ui/components";
import { TransferListErrorMapper } from "#payments/transfer/infrastructure/ui/error-mapper/transferListErrorMapper";
import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { BalanceCard } from "#wallet/infrastructure/ui/components";
import { useWalletData } from "#wallet/infrastructure/ui/hooks";

interface HomePageProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function HomePage<TUser extends UserWithId>({
  authStore,
}: HomePageProps<TUser>) {
  const router = useRouter();
  const { user } = useAuthContext(authStore);
  const { balance, isLoading } = useWalletData({ authStore });

  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState<null | string>(
    null
  );
  const errorMappers = useMemo(() => [new TransferListErrorMapper()], []);
  const { handleError } = useErrorHandler(errorMappers);

  const handleSendMoney = () => {
    router.push("/transactions/new");
  };

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

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
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <BalanceCard
            balance={balance}
            isLoading={isLoading}
            onSendMoney={handleSendMoney}
          />

          <MovementsList
            error={transactionsError}
            isLoading={isLoadingTransactions}
            transactions={transactions}
          />
        </VStack>
      </Container>
    </Box>
  );
}
