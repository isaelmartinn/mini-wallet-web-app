import { Transfer } from "#payments/transfer/domain/entities";
import { TransferAmount } from "#payments/transfer/domain/value-objects";

export interface ConfirmTransferResult {
  success: boolean;
  transfer: Transfer;
}

export interface CreateTransferParams {
  amount: TransferAmount;
  description: string;
  recipientId: string;
  userId: string;
}

export interface TransferRepository {
  confirm(transferId: string): Promise<ConfirmTransferResult>;
  create(params: CreateTransferParams): Promise<Transfer>;
  findById(transferId: string): Promise<null | Transfer>;
  findByUserId(userId: string): Promise<Transfer[]>;
}
