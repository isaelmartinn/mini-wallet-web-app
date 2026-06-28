import { BalanceAmount } from "#wallet/domain/value-objects";

export interface Balance {
  getAmount(): BalanceAmount;
  getCurrency(): string;
  getUserId(): string;
}
