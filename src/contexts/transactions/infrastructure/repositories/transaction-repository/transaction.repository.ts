import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { Transaction, TransactionRepository } from "#transactions/domain";
import { TransactionFetchFailedError } from "#transactions/domain/errors/transaction-fetch-failed.error";
import { TRANSACTION_FIXTURES } from "#transactions/infrastructure/repositories/transaction-repository/transaction.fixtures";

export class TransactionRepositoryImpl implements TransactionRepository {
  private transactions: Transaction[] = TRANSACTION_FIXTURES;

  async findAll(): Promise<Transaction[]> {
    const { delays, errorRates } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail =
      Math.random() > errorRates.transactions.getTransactions.SUCCESS;

    if (shouldFail) {
      throw new TransactionFetchFailedError();
    }

    return [...this.transactions];
  }
}
