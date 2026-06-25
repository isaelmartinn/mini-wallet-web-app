import { findMockUserById } from "#shared/infrastructure/mocks";
import { Amount, Balance, UserProfile } from "#wallet/domain";

export function createMockBalance(userId: string): Balance {
  const mockUser = findMockUserById(userId);

  if (!mockUser) {
    return Balance.create({
      amount: Amount.create(0),
      currency: "MXN",
      userId,
    });
  }

  return Balance.create({
    amount: Amount.create(mockUser.wallet.balance.amount),
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
