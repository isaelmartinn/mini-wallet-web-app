import { useEffect } from "react";

import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { GetBalanceUseCase, GetUserProfileUseCase } from "#wallet/application";
import { WalletRepository } from "#wallet/infrastructure/repositories";
import { useWalletStore } from "#wallet/infrastructure/store";

interface UseWalletDataOptions<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function useWalletData<TUser extends UserWithId>({
  authStore,
}: UseWalletDataOptions<TUser>) {
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
        const walletRepository = WalletRepository.getInstance();
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

  return {
    balance,
    isLoading,
    userProfile,
  };
}
