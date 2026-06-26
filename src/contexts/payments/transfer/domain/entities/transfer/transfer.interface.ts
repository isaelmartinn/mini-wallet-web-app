import {
  TransferDate,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";

export interface CreateTransferParams {
  amount: number;
  date: Date;
  description: string;
  id: string;
  status: TransferStatus;
  type: TransferType;
}

export interface Transfer {
  getAmount(): number;
  getDate(): TransferDate;
  getDescription(): string;
  getId(): string;
  getStatus(): TransferStatus;
  getType(): TransferType;
}
