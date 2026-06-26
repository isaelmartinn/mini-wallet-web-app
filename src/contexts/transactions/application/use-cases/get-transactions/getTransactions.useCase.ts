import { GetTransactionsUseCase as GetTransactionsUseCaseInterface } from "#transactions/application/use-cases/get-transactions/getTransactions.interface";
import { Transaction, TransactionRepository } from "#transactions/domain";

export class GetTransactionsUseCase implements GetTransactionsUseCaseInterface {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.findAll();

    return transactions.sort((a, b) => {
      const dateA = a.getDate().getValue().getTime();
      const dateB = b.getDate().getValue().getTime();
      return dateB - dateA;
    });
  }
}
