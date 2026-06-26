export enum TransferTypeEnum {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}

export class TransferType {
  private constructor(private readonly value: TransferTypeEnum) {}

  static expense(): TransferType {
    return new TransferType(TransferTypeEnum.EXPENSE);
  }

  static income(): TransferType {
    return new TransferType(TransferTypeEnum.INCOME);
  }

  equals(other: TransferType): boolean {
    return this.value === other.value;
  }

  getValue(): TransferTypeEnum {
    return this.value;
  }

  isExpense(): boolean {
    return this.value === TransferTypeEnum.EXPENSE;
  }

  isIncome(): boolean {
    return this.value === TransferTypeEnum.INCOME;
  }
}
