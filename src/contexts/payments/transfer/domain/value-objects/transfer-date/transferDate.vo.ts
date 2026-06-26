import { TransferDateInvalidError } from "#payments/transfer/domain/errors";

export class TransferDate {
  private constructor(private readonly value: Date) {}

  static create(value: Date | string): TransferDate {
    const date = typeof value === "string" ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      throw new TransferDateInvalidError();
    }

    return new TransferDate(date);
  }

  static now(): TransferDate {
    return new TransferDate(new Date());
  }

  equals(other: TransferDate): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  getValue(): Date {
    return this.value;
  }

  isAfter(other: TransferDate): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  isBefore(other: TransferDate): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  toISOString(): string {
    return this.value.toISOString();
  }
}
