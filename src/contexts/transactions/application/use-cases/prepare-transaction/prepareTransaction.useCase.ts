import { TransactionValidationService } from "#transactions/domain/services";

import {
  PrepareTransactionParams,
  PrepareTransactionResult,
  PrepareTransactionUseCase as PrepareTransactionUseCaseInterface,
} from "./prepareTransaction.interface";

export class PrepareTransactionUseCase implements PrepareTransactionUseCaseInterface {
  constructor(
    private readonly transactionValidationService: TransactionValidationService
  ) {}

  async execute(
    params: PrepareTransactionParams
  ): Promise<PrepareTransactionResult> {
    await this.transactionValidationService.validateTransaction({
      amount: params.amount,
      recipientId: params.recipientId,
      userId: params.userId,
    });

    return {
      amount: params.amount,
      recipientId: params.recipientId,
      userId: params.userId,
    };
  }
}
