import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { Balance, UserProfile } from "#wallet/domain/entities";
import { WalletRepository as WalletRepositoryInterface } from "#wallet/domain/repositories";

import { createMockBalance, createMockUserProfile } from "./wallet.fixtures";

export class WalletRepository implements WalletRepositoryInterface {
  async getBalance(userId: string): Promise<Balance> {
    await this.simulateDelay();
    return createMockBalance(userId);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    await this.simulateDelay();
    return createMockUserProfile(userId);
  }

  private simulateDelay(): Promise<void> {
    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;

    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
