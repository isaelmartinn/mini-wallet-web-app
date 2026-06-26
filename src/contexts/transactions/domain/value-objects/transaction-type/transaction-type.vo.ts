export enum TransactionTypeEnum {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}

export class TransactionType {
  private constructor(private readonly value: TransactionTypeEnum) {}

  static expense(): TransactionType {
    return new TransactionType(TransactionTypeEnum.EXPENSE);
  }

  static income(): TransactionType {
    return new TransactionType(TransactionTypeEnum.INCOME);
  }

  equals(other: TransactionType): boolean {
    return this.value === other.value;
  }

  getValue(): TransactionTypeEnum {
    return this.value;
  }

  isExpense(): boolean {
    return this.value === TransactionTypeEnum.EXPENSE;
  }

  isIncome(): boolean {
    return this.value === TransactionTypeEnum.INCOME;
  }
}
