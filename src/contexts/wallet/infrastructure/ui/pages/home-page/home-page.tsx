"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { GetBalanceUseCase, GetUserProfileUseCase } from "#wallet/application";
import { WalletRepository } from "#wallet/infrastructure/repositories";
import { useWalletStore } from "#wallet/infrastructure/store";

import { BalanceCard, UserHeader } from "../../components";

interface HomePageProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function HomePage<TUser extends UserWithId>({
  authStore,
}: HomePageProps<TUser>) {
  const { user } = useAuthContext(authStore);
  const {
    balance,
    isLoading,
    setBalance,
    setLoading,
    setUserProfile,
    userProfile,
  } = useWalletStore();

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

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack gap={6} width="full">
          <UserHeader isLoading={isLoading} userProfile={userProfile} />

          <BalanceCard balance={balance} isLoading={isLoading} />
        </VStack>
      </Container>
    </Box>
  );
}
