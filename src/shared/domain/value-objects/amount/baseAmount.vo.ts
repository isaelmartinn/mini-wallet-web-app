import { AmountInvalidError } from "#shared/domain/errors";
import { CurrencyFormatter } from "#shared/domain/interfaces";

export abstract class BaseAmount {
  protected constructor(protected readonly value: number) {}

  protected static roundValue(value: number): number {
    return Math.round(value * 100) / 100;
  }

  protected static validateNumber(value: number): void {
    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
      throw new AmountInvalidError();
    }
  }

  format(formatter: CurrencyFormatter, currency: string): string {
    return formatter.format(this.value, currency);
  }

  getValue(): number {
    return this.value;
  }

  isGreaterThan(other: { getValue(): number }): boolean {
    return this.value > other.getValue();
  }

  isGreaterThanOrEqual(other: { getValue(): number }): boolean {
    return this.value >= other.getValue();
  }

  isLessThan(other: { getValue(): number }): boolean {
    return this.value < other.getValue();
  }
}
