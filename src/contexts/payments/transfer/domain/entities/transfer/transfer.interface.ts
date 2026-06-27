import {
  TransferDate,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { Amount } from "#shared/domain/value-objects";

export interface CreateTransferParams {
  amount: Amount;
  date: Date;
  description: string;
  id: string;
  recipientId: string;
  status: TransferStatus;
  type: TransferType;
  userId: string;
}

export interface RehydrateTransferParams {
  amount: Amount;
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
  getAmount(): Amount;
  getDate(): TransferDate;
  getDescription(): string;
  getId(): string;
  getRecipientId(): string;
  getStatus(): TransferStatus;
  getType(): TransferType;
  getUserId(): string;
}
