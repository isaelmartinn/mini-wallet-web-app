import { Transaction } from "#transactions/domain";

export interface GetTransactionsUseCase {
  execute(): Promise<Transaction[]>;
}
