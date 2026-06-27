import { Transfer } from "#payments/transfer/domain/entities";
import { Amount } from "#shared/domain/value-objects";

export interface ConfirmTransferResult {
  success: boolean;
  transfer: Transfer;
}

export interface CreateTransferParams {
  amount: Amount;
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
