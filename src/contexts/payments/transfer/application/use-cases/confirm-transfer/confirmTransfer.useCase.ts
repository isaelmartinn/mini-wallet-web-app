import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferRepository } from "#payments/transfer/domain/repositories";
import { TransferAmount } from "#payments/transfer/domain/value-objects";
import { BalanceProvider } from "#shared/domain/interfaces";

import {
  ConfirmTransferParams,
  ConfirmTransferUseCase as ConfirmTransferUseCaseInterface,
} from "./confirmTransfer.interface";

export class ConfirmTransferUseCase implements ConfirmTransferUseCaseInterface {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly balanceProvider: BalanceProvider
  ) {}

  async execute(params: ConfirmTransferParams): Promise<Transfer> {
    const currentBalance = await this.balanceProvider.getAvailableBalance(
      params.userId
    );
    const transferAmount = TransferAmount.create(params.amount);

    if (currentBalance < transferAmount.getValue()) {
      throw new InsufficientBalanceError();
    }

    const result = await this.transferRepository.confirm(params.transferId);

    if (result.success) {
      const newAmountValue = currentBalance - transferAmount.getValue();
      await this.balanceProvider.updateBalance(params.userId, newAmountValue);
    }

    return result.transfer;
  }
}
