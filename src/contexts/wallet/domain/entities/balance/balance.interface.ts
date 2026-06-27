import { Amount } from "#shared/domain/value-objects";

export interface Balance {
  getAmount(): Amount;
  getCurrency(): string;
  getUserId(): string;
}
