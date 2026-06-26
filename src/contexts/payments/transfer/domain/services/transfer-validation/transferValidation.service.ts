import {
  InsufficientBalanceError,
  InvalidAmountError,
  RecipientRequiredError,
} from "#payments/transfer/domain/errors";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";

import {
  TransferValidationService as TransferValidationServiceInterface,
  ValidateTransferParams,
} from "./transferValidation.service.interface";

export class TransferValidationService implements TransferValidationServiceInterface {
  constructor(private readonly balanceProvider: BalanceProvider) {}

  async validateTransfer(params: ValidateTransferParams): Promise<void> {
    if (params.amount <= 0) {
      throw new InvalidAmountError();
    }

    if (!params.recipientId || params.recipientId.trim() === "") {
      throw new RecipientRequiredError();
    }

    const availableBalance = await this.balanceProvider.getAvailableBalance(
      params.userId
    );

    if (params.amount > availableBalance) {
      throw new InsufficientBalanceError();
    }
  }
}
