import { TransactionDate } from "#transactions/domain/value-objects/transaction-date/transaction-date.vo";
import { TransactionStatus } from "#transactions/domain/value-objects/transaction-status/transaction-status.vo";
import { TransactionType } from "#transactions/domain/value-objects/transaction-type/transaction-type.vo";

export interface CreateTransactionParams {
  amount: number;
  date: Date;
  description: string;
  id: string;
  status: TransactionStatus;
  type: TransactionType;
}

export interface Transaction {
  getAmount(): number;
  getDate(): TransactionDate;
  getDescription(): string;
  getId(): string;
  getStatus(): TransactionStatus;
  getType(): TransactionType;
}
