import { Amount } from "#shared/domain/value-objects";

import { Balance as BalanceInterface } from "./balance.interface";

export interface CreateBalanceParams {
  amount: Amount;
  currency: string;
  userId: string;
}

export class Balance implements BalanceInterface {
  private constructor(
    private readonly userId: string,
    private readonly amount: Amount,
    private readonly currency: string
  ) {}

  static create(params: CreateBalanceParams): Balance {
    return new Balance(params.userId, params.amount, params.currency);
  }

  getAmount(): Amount {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  getUserId(): string {
    return this.userId;
  }
}
