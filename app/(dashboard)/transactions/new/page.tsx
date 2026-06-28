"use client";

import { Suspense } from "react";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { NewTransferPage } from "#payments/transfer/infrastructure/ui/pages";
import { BalanceProviderAdapter } from "#wallet/balance/infrastructure/providers/balance-provider/balance-provider.adapter";
import { WalletRepository } from "#wallet/balance/infrastructure/repositories";

const walletRepository = WalletRepository.getInstance();
const balanceProvider = new BalanceProviderAdapter(walletRepository);

export default function NewTransactionRoute() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewTransferPage
        authStore={useAuthStore}
        balanceProvider={balanceProvider}
      />
    </Suspense>
  );
}
