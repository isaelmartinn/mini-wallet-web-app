import { Balance } from "#wallet/domain/entities";

export interface WalletPersistenceService {
  clearBalance(userId: string): void;
  getBalance(userId: string): Balance | null;
  saveBalance(userId: string, balance: Balance): void;
}
