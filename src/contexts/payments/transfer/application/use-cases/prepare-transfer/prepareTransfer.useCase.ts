import { ContactRepository } from "#payments/contact/domain/repositories";
import { InsufficientBalanceError } from "#payments/transfer/domain/errors";
import { TransferRepository } from "#payments/transfer/domain/repositories";
import { TransferAmount } from "#payments/transfer/domain/value-objects";
import { BalanceProvider } from "#shared/domain/interfaces";

import {
  PrepareTransferParams,
  PrepareTransferResult,
  PrepareTransferUseCase as PrepareTransferUseCaseInterface,
} from "./prepareTransfer.interface";

export class PrepareTransferUseCase implements PrepareTransferUseCaseInterface {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly balanceProvider: BalanceProvider,
    private readonly contactRepository: ContactRepository
  ) {}

  async execute(params: PrepareTransferParams): Promise<PrepareTransferResult> {
    const amount = TransferAmount.create(params.amount);

    const availableBalance = await this.balanceProvider.getAvailableBalance(
      params.userId
    );

    if (availableBalance < params.amount) {
      throw new InsufficientBalanceError();
    }

    const contact = await this.contactRepository.findById(params.recipientId);
    const recipientName = contact ? contact.getName() : "Destinatario";

    const transfer = await this.transferRepository.create({
      amount,
      description: `Transferencia a ${recipientName}`,
      recipientId: params.recipientId,
      userId: params.userId,
    });

    return {
      amount: params.amount,
      recipientId: params.recipientId,
      transferId: transfer.getId(),
      userId: params.userId,
    };
  }
}
