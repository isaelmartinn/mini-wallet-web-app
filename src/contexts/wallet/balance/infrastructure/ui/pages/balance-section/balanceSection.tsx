"use client";

import { useRouter } from "next/navigation";

import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { BalanceCard } from "#wallet/balance/infrastructure/ui/components";
import { useWalletData } from "#wallet/balance/infrastructure/ui/hooks";

interface BalanceSectionProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
}

export function BalanceSection<TUser extends UserWithId>({
  authStore,
}: BalanceSectionProps<TUser>) {
  const router = useRouter();
  const { balance, isLoading } = useWalletData({ authStore });

  const handleSendMoney = () => {
    router.push("/transactions/new");
  };

  return (
    <BalanceCard
      balance={balance}
      isLoading={isLoading}
      onSendMoney={handleSendMoney}
    />
  );
}
