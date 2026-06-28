import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { LocalStorageService } from "#shared/infrastructure/storage";
import { Balance } from "#wallet/balance/domain/entities";
import { WalletRepository as WalletRepositoryInterface } from "#wallet/balance/domain/repositories";
import { WalletPersistenceService } from "#wallet/balance/infrastructure/persistence";
import { UserProfile } from "#wallet/user-profile/domain/entities";

import { createMockBalance, createMockUserProfile } from "./wallet.fixtures";

export class WalletRepository implements WalletRepositoryInterface {
  private static instance: WalletRepository;
  private balances: Map<string, Balance> = new Map();
  private persistenceService: WalletPersistenceService;

  private constructor() {
    const storageService = new LocalStorageService();
    this.persistenceService = new WalletPersistenceService(storageService);
  }

  static getInstance(): WalletRepository {
    if (!WalletRepository.instance) {
      WalletRepository.instance = new WalletRepository();
    }
    return WalletRepository.instance;
  }

  static resetInstance(): void {
    WalletRepository.instance = undefined as unknown as WalletRepository;
  }

  async getBalance(userId: string): Promise<Balance> {
    await this.simulateDelay();

    const cachedBalance = this.balances.get(userId);
    if (cachedBalance) {
      return cachedBalance;
    }

    const persistedBalance = this.persistenceService.getBalance(userId);
    if (persistedBalance) {
      this.balances.set(userId, persistedBalance);
      return persistedBalance;
    }

    const newBalance = createMockBalance(userId);
    this.balances.set(userId, newBalance);
    this.persistenceService.saveBalance(userId, newBalance);
    return newBalance;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    await this.simulateDelay();
    return createMockUserProfile(userId);
  }

  async updateBalance(userId: string, newBalance: Balance): Promise<void> {
    await this.simulateDelay();
    this.balances.set(userId, newBalance);
    this.persistenceService.saveBalance(userId, newBalance);
  }

  private simulateDelay(): Promise<void> {
    const delay =
      Math.random() * (MOCK_CONFIG.delays.max - MOCK_CONFIG.delays.min) +
      MOCK_CONFIG.delays.min;

    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
