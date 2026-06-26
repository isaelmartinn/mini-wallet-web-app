import { TransactionDateInvalidError } from "#transactions/domain/errors/transaction-date-invalid.error";

export class TransactionDate {
  private constructor(private readonly value: Date) {}

  static create(value: Date | string): TransactionDate {
    const date = typeof value === "string" ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      throw new TransactionDateInvalidError();
    }

    return new TransactionDate(date);
  }

  static now(): TransactionDate {
    return new TransactionDate(new Date());
  }

  equals(other: TransactionDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  getValue(): Date {
    return this.value;
  }

  isAfter(other: TransactionDate): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  isBefore(other: TransactionDate): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  toISOString(): string {
    return this.value.toISOString();
  }
}
