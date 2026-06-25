import { Amount } from "#wallet/domain/value-objects";

export interface Balance {
  getAmount(): Amount;
  getCurrency(): string;
  getUserId(): string;
}
