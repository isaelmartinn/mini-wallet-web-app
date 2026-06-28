import {
  TransferAmount,
  TransferDate,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";

export interface CreateTransferParams {
  amount: TransferAmount;
  date: Date;
  description: string;
  id: string;
  recipientId: string;
  status: TransferStatus;
  type: TransferType;
  userId: string;
}

export interface RehydrateTransferParams {
  amount: TransferAmount;
  date: Date;
  description: string;
  id: string;
  recipientId: string;
  status: TransferStatus;
  type: TransferType;
  userId: string;
}

export interface Transfer {
  cancel(): Transfer;
  confirm(): Transfer;
  fail(): Transfer;
  getAmount(): TransferAmount;
  getDate(): TransferDate;
  getDescription(): string;
  getId(): string;
  getRecipientId(): string;
  getStatus(): TransferStatus;
  getType(): TransferType;
  getUserId(): string;
}
