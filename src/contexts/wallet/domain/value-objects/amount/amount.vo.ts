import { CurrencyFormatter } from "#shared/domain/interfaces";
import { AmountInvalidError, AmountNegativeError } from "#wallet/domain/errors";

import { Amount as AmountInterface } from "./amount.interface";

const MIN_AMOUNT = 0;

export class Amount implements AmountInterface {
  private constructor(private readonly value: number) {}

  static create(value: number): Amount {
    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
      throw new AmountInvalidError();
    }

    if (value < MIN_AMOUNT) {
      throw new AmountNegativeError();
    }

    const roundedValue = Math.round(value * 100) / 100;

    return new Amount(roundedValue);
  }

  static rehydrate(value: number): Amount {
    return new Amount(value);
  }

  add(other: AmountInterface): Amount {
    return Amount.create(this.value + other.getValue());
  }

  format(formatter: CurrencyFormatter, currency: string): string {
    return formatter.format(this.value, currency);
  }

  getValue(): number {
    return this.value;
  }

  isGreaterThan(other: AmountInterface): boolean {
    return this.value > other.getValue();
  }

  isGreaterThanOrEqual(other: AmountInterface): boolean {
    return this.value >= other.getValue();
  }

  isLessThan(other: AmountInterface): boolean {
    return this.value < other.getValue();
  }

  subtract(other: AmountInterface): Amount {
    return Amount.create(this.value - other.getValue());
  }
}
