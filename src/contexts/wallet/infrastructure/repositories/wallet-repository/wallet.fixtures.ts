import { findMockUserById } from "#shared/infrastructure/mocks";
import { Balance, UserProfile } from "#wallet/domain/entities";
import { BalanceAmount } from "#wallet/domain/value-objects";

export function createMockBalance(userId: string): Balance {
  const mockUser = findMockUserById(userId);

  if (!mockUser) {
    return Balance.create({
      amount: BalanceAmount.create(0),
      currency: "MXN",
      userId,
    });
  }

  return Balance.create({
    amount: BalanceAmount.create(mockUser.wallet.balance.amount),
    currency: mockUser.wallet.balance.currency,
    userId: mockUser.id,
  });
}

export function createMockUserProfile(userId: string): UserProfile {
  const mockUser = findMockUserById(userId);

  if (!mockUser) {
    return UserProfile.create({
      fullName: "Usuario Desconocido",
      userId,
    });
  }

  return UserProfile.create({
    fullName: mockUser.wallet.fullName,
    userId: mockUser.id,
  });
}
