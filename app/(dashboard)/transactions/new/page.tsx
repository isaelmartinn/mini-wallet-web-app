"use client";

import { useAuthStore } from "#auth/infrastructure/store";
import { NewTransactionPage } from "#transactions/infrastructure/ui/pages";
import { BalanceProviderAdapter } from "#wallet/infrastructure/providers/balance-provider/balance-provider.adapter";
import { WalletRepository } from "#wallet/infrastructure/repositories";

const walletRepository = new WalletRepository();
const balanceProvider = new BalanceProviderAdapter(walletRepository);

export default function NewTransactionRoute() {
  return (
    <NewTransactionPage
      authStore={useAuthStore}
      balanceProvider={balanceProvider}
    />
  );
}
