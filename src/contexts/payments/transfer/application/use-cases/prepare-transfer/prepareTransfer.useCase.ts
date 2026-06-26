import { TransferValidationService } from "#payments/transfer/domain/services";

import {
  PrepareTransferParams,
  PrepareTransferResult,
  PrepareTransferUseCase as PrepareTransferUseCaseInterface,
} from "./prepareTransfer.interface";

export class PrepareTransferUseCase implements PrepareTransferUseCaseInterface {
  constructor(
    private readonly transferValidationService: TransferValidationService
  ) {}

  async execute(params: PrepareTransferParams): Promise<PrepareTransferResult> {
    await this.transferValidationService.validateTransfer({
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
