import { Balance } from "#wallet/balance/domain/entities";
import { UserProfile } from "#wallet/user-profile/domain/entities";

export interface WalletRepository {
  getBalance(userId: string): Promise<Balance>;
  getUserProfile(userId: string): Promise<UserProfile>;
  updateBalance(userId: string, newBalance: Balance): Promise<void>;
}
