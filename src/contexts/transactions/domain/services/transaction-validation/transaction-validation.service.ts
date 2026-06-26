import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";

import { InsufficientBalanceError } from "../../errors/insufficient-balance.error";
import { InvalidAmountError } from "../../errors/invalid-amount.error";
import { RecipientRequiredError } from "../../errors/recipient-required.error";
import {
  TransactionValidationService as TransactionValidationServiceInterface,
  ValidateTransactionParams,
} from "./transaction-validation.service.interface";

export class TransactionValidationService implements TransactionValidationServiceInterface {
  constructor(private readonly balanceProvider: BalanceProvider) {}

  async validateTransaction(params: ValidateTransactionParams): Promise<void> {
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
