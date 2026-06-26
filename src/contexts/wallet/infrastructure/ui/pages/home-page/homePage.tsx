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
import { GetBalanceUseCase, GetUserProfileUseCase } from "#wallet/application";
import { WalletRepository } from "#wallet/infrastructure/repositories";
import { useWalletStore } from "#wallet/infrastructure/store";
import { BalanceCard } from "#wallet/infrastructure/ui/components";

interface HomePageProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function HomePage<TUser extends UserWithId>({
  authStore,
}: HomePageProps<TUser>) {
  const router = useRouter();
  const { user } = useAuthContext(authStore);
  const { balance, isLoading, setBalance, setLoading, setUserProfile } =
    useWalletStore();

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
    const loadWalletData = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const walletRepository = new WalletRepository();
        const getBalanceUseCase = new GetBalanceUseCase(walletRepository);
        const getUserProfileUseCase = new GetUserProfileUseCase(
          walletRepository
        );

        const [balanceData, profileData] = await Promise.all([
          getBalanceUseCase.execute({ userId: user.getId() }),
          getUserProfileUseCase.execute({ userId: user.getId() }),
        ]);

        setBalance(balanceData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error loading wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [user, setBalance, setUserProfile, setLoading]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

      setIsLoadingTransactions(true);
      setTransactionsError(null);

      try {
        const transferRepository = new TransferRepositoryImpl();
        const getTransfersUseCase = new GetTransfersUseCase(transferRepository);

        const transfersData = await getTransfersUseCase.execute();
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
