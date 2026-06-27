import { Balance, UserProfile } from "#wallet/domain/entities";

export interface WalletRepository {
  getBalance(userId: string): Promise<Balance>;
  getUserProfile(userId: string): Promise<UserProfile>;
  updateBalance(userId: string, newBalance: Balance): Promise<void>;
}
