import { BalanceProvider } from "#shared/domain/interfaces";
import { Balance } from "#wallet/balance/domain/entities";
import { WalletRepository } from "#wallet/balance/domain/repositories";
import { BalanceAmount } from "#wallet/balance/domain/value-objects";

export class BalanceProviderAdapter implements BalanceProvider {
  constructor(private readonly walletRepository: WalletRepository) {}

  async getAvailableBalance(userId: string): Promise<number> {
    const balance = await this.walletRepository.getBalance(userId);
    return balance.getAmount().getValue();
  }

  async updateBalance(userId: string, newAmount: number): Promise<void> {
    const balanceAmount = BalanceAmount.create(newAmount);
    const newBalance = Balance.create({
      amount: balanceAmount,
      currency: "MXN",
      userId,
    });
    await this.walletRepository.updateBalance(userId, newBalance);
  }
}
