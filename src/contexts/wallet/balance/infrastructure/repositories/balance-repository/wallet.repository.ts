import { HttpClient } from "#shared/infrastructure";
import { LocalStorageService } from "#shared/infrastructure/storage";
import { Balance } from "#wallet/balance/domain/entities";
import { WalletRepository as WalletRepositoryInterface } from "#wallet/balance/domain/repositories";
import { BalanceAmount } from "#wallet/balance/domain/value-objects";
import { WalletPersistenceService } from "#wallet/balance/infrastructure/persistence";
import { UserProfile } from "#wallet/user-profile/domain/entities";

interface BalanceResponse {
  amount: number;
  currency: string;
}

interface ProfileResponse {
  fullName: string;
}

export class WalletRepository implements WalletRepositoryInterface {
  private static instance: WalletRepository;
  private balances: Map<string, Balance> = new Map();
  private readonly httpClient: HttpClient;
  private persistenceService: WalletPersistenceService;

  private constructor() {
    this.httpClient = new HttpClient();
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
    const cachedBalance = this.balances.get(userId);
    if (cachedBalance) {
      return cachedBalance;
    }

    const persistedBalance = this.persistenceService.getBalance(userId);
    if (persistedBalance) {
      this.balances.set(userId, persistedBalance);
      return persistedBalance;
    }

    const response = await this.httpClient.get<BalanceResponse>(
      `/api/wallet/balance?userId=${userId}`
    );

    const balance = Balance.create({
      amount: BalanceAmount.create(response.amount),
      currency: response.currency,
      userId,
    });

    this.balances.set(userId, balance);
    this.persistenceService.saveBalance(userId, balance);
    return balance;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await this.httpClient.get<ProfileResponse>(
      `/api/wallet/profile?userId=${userId}`
    );

    return UserProfile.create({
      fullName: response.fullName,
      userId,
    });
  }

  async updateBalance(userId: string, newBalance: Balance): Promise<void> {
    this.balances.set(userId, newBalance);
    this.persistenceService.saveBalance(userId, newBalance);
  }
}
