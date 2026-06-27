import { Amount } from "#shared/domain/value-objects";
import { LocalStorageService } from "#shared/infrastructure/storage";
import { Balance } from "#wallet/domain/entities";

import { WalletPersistenceService as WalletPersistenceServiceInterface } from "./walletPersistenceService.interface";

interface BalanceData {
  amount: number;
  currency: string;
  userId: string;
}

export class WalletPersistenceService implements WalletPersistenceServiceInterface {
  private static readonly STORAGE_KEY_PREFIX = "wallet:balance";

  constructor(private readonly storageService: LocalStorageService) {}

  clearBalance(userId: string): void {
    const key = this.getStorageKey(userId);
    this.storageService.remove(key);
  }

  getBalance(userId: string): Balance | null {
    const key = this.getStorageKey(userId);
    const data = this.storageService.get<BalanceData>(key);

    if (!data) {
      return null;
    }

    try {
      return Balance.create({
        amount: Amount.create(data.amount),
        currency: data.currency,
        userId: data.userId,
      });
    } catch (error) {
      console.error("Error reconstructing Balance from storage:", error);
      return null;
    }
  }

  saveBalance(userId: string, balance: Balance): void {
    const key = this.getStorageKey(userId);
    const data: BalanceData = {
      amount: balance.getAmount().getValue(),
      currency: balance.getCurrency(),
      userId: balance.getUserId(),
    };

    this.storageService.set(key, data);
  }

  private getStorageKey(userId: string): string {
    return `${WalletPersistenceService.STORAGE_KEY_PREFIX}:${userId}`;
  }
}
