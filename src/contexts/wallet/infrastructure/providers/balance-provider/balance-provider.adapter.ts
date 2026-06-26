import { BalanceProvider } from "#shared/domain/interfaces";
import { WalletRepository } from "#wallet/domain/repositories";

export class BalanceProviderAdapter implements BalanceProvider {
  constructor(private readonly walletRepository: WalletRepository) {}

  async getAvailableBalance(userId: string): Promise<number> {
    const balance = await this.walletRepository.getBalance(userId);
    return balance.getAmount().getValue();
  }
}
