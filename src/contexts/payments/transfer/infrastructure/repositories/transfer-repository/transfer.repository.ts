import { Transfer, TransferRepository } from "#payments/transfer/domain";
import { TransferFetchFailedError } from "#payments/transfer/domain/errors";
import { TRANSACTION_FIXTURES } from "#payments/transfer/infrastructure/repositories/transfer-repository/transfer.fixtures";
import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";

export class TransferRepositoryImpl implements TransferRepository {
  private transfers: Transfer[] = TRANSACTION_FIXTURES;

  async findAll(): Promise<Transfer[]> {
    const { delays, errorRates } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail =
      Math.random() > errorRates.transfers.getTransfers.SUCCESS;

    if (shouldFail) {
      throw new TransferFetchFailedError();
    }

    return [...this.transfers];
  }
}
