import { Transaction } from "#transactions/domain/entities/transaction/transaction.entity";

export interface TransactionRepository {
  findAll(): Promise<Transaction[]>;
}
