"use client";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { NewTransferPage } from "#payments/transfer/infrastructure/ui/pages";
import { BalanceProviderAdapter } from "#wallet/infrastructure/providers/balance-provider/balance-provider.adapter";
import { WalletRepository } from "#wallet/infrastructure/repositories";

const walletRepository = WalletRepository.getInstance();
const balanceProvider = new BalanceProviderAdapter(walletRepository);

export default function NewTransactionRoute() {
  return (
    <NewTransferPage
      authStore={useAuthStore}
      balanceProvider={balanceProvider}
    />
  );
}
