import { Transfer } from "#payments/transfer/domain/entities";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferRepository } from "#payments/transfer/domain/repositories";
import { Amount } from "#shared/domain/value-objects";
import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";

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
    const transferAmount = Amount.create(params.amount);

    if (currentBalance.getAmount().isLessThan(transferAmount)) {
      throw new InsufficientBalanceError();
    }

    const result = await this.transferRepository.confirm(params.transferId);

    if (result.success) {
      const newAmount = currentBalance.getAmount().subtract(transferAmount);
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
