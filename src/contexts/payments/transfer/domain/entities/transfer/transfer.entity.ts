import {
  TransferDate,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";

import {
  CreateTransferParams,
  Transfer as TransferInterface,
} from "./transfer.interface";

export class Transfer implements TransferInterface {
  private constructor(
    private readonly amount: number,
    private readonly date: TransferDate,
    private readonly description: string,
    private readonly id: string,
    private readonly status: TransferStatus,
    private readonly type: TransferType
  ) {}

  static create(params: CreateTransferParams): Transfer {
    const date = TransferDate.create(params.date);

    return new Transfer(
      params.amount,
      date,
      params.description,
      params.id,
      params.status,
      params.type
    );
  }

  getAmount(): number {
    return this.amount;
  }

  getDate(): TransferDate {
    return this.date;
  }

  getDescription(): string {
    return this.description;
  }

  getId(): string {
    return this.id;
  }

  getStatus(): TransferStatus {
    return this.status;
  }

  getType(): TransferType {
    return this.type;
  }
}
