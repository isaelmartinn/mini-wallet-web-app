import {
  CreateTransactionParams,
  Transaction as TransactionInterface,
} from "#transactions/domain/entities/transaction/transaction.interface";
import { TransactionDate } from "#transactions/domain/value-objects/transaction-date/transaction-date.vo";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

export class Transaction implements TransactionInterface {
  private constructor(
    private readonly amount: number,
    private readonly date: TransactionDate,
    private readonly description: string,
    private readonly id: string,
    private readonly status: TransactionStatus,
    private readonly type: TransactionType
  ) {}

  static create(params: CreateTransactionParams): Transaction {
    const date = TransactionDate.create(params.date);

    return new Transaction(
      params.amount,
      date,
      params.description,
      params.id,
      params.status,
      params.type
    );
  }

  getAmount(): number {
    return this.amount;
  }

  getDate(): TransactionDate {
    return this.date;
  }

  getDescription(): string {
    return this.description;
  }

  getId(): string {
    return this.id;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  getType(): TransactionType {
    return this.type;
  }
}
