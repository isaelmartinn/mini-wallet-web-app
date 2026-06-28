import { BalanceAmount } from "#wallet/balance/domain/value-objects";

export interface Balance {
  getAmount(): BalanceAmount;
  getCurrency(): string;
  getUserId(): string;
}
