import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferRepository } from "#payments/transfer/domain/repositories";
import { TransferAmount } from "#payments/transfer/domain/value-objects";
import { Balance } from "#wallet/balance/domain/entities";
import { WalletRepository } from "#wallet/balance/domain/repositories";
import { BalanceAmount } from "#wallet/balance/domain/value-objects";

import {
  ConfirmTransferParams,
  ConfirmTransferUseCase as ConfirmTransferUseCaseInterface,
} from "./confirmTransfer.interface";

export class ConfirmTransferUseCase implements ConfirmTransferUseCaseInterface {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly walletRepository: WalletRepository
  ) {}

  async execute(params: ConfirmTransferParams): Promise<Transfer> {
    const currentBalance = await this.walletRepository.getBalance(
      params.userId
    );
    const transferAmount = TransferAmount.create(params.amount);

    if (currentBalance.getAmount().isLessThan(transferAmount)) {
      throw new InsufficientBalanceError();
    }

    const result = await this.transferRepository.confirm(params.transferId);

    if (result.success) {
      const newAmountValue =
        currentBalance.getAmount().getValue() - transferAmount.getValue();
      const newAmount = BalanceAmount.create(newAmountValue);
      const newBalance = Balance.create({
        amount: newAmount,
        currency: currentBalance.getCurrency(),
        userId: currentBalance.getUserId(),
      });

      await this.walletRepository.updateBalance(
        currentBalance.getUserId(),
        newBalance
      );
    }

    return result.transfer;
  }
}
