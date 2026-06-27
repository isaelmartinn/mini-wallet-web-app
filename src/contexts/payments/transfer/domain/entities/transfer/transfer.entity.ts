import {
  InvalidDescriptionError,
  InvalidStateTransitionError,
  RecipientRequiredError,
} from "#payments/transfer/domain/errors";
import {
  TransferDate,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { Amount } from "#shared/domain/value-objects";

import {
  CreateTransferParams,
  RehydrateTransferParams,
  Transfer as TransferInterface,
} from "./transfer.interface";

export class Transfer implements TransferInterface {
  private constructor(
    private readonly amount: Amount,
    private readonly date: TransferDate,
    private readonly description: string,
    private readonly id: string,
    private readonly recipientId: string,
    private readonly status: TransferStatus,
    private readonly type: TransferType,
    private readonly userId: string
  ) {}

  static create(params: CreateTransferParams): Transfer {
    if (!params.recipientId || params.recipientId.trim() === "") {
      throw new RecipientRequiredError();
    }

    if (!params.description || params.description.trim() === "") {
      throw new InvalidDescriptionError();
    }

    const date = TransferDate.create(params.date);

    return new Transfer(
      params.amount,
      date,
      params.description,
      params.id,
      params.recipientId,
      params.status,
      params.type,
      params.userId
    );
  }

  static rehydrate(params: RehydrateTransferParams): Transfer {
    const date = TransferDate.create(params.date);

    return new Transfer(
      params.amount,
      date,
      params.description,
      params.id,
      params.recipientId,
      params.status,
      params.type,
      params.userId
    );
  }

  cancel(): Transfer {
    if (!this.status.isPending()) {
      throw new InvalidStateTransitionError(
        this.status.getValue(),
        "CANCELLED"
      );
    }

    return new Transfer(
      this.amount,
      this.date,
      this.description,
      this.id,
      this.recipientId,
      TransferStatus.failed(),
      this.type,
      this.userId
    );
  }

  confirm(): Transfer {
    if (!this.status.isPending()) {
      throw new InvalidStateTransitionError(this.status.getValue(), "SUCCESS");
    }

    return new Transfer(
      this.amount,
      this.date,
      this.description,
      this.id,
      this.recipientId,
      TransferStatus.success(),
      this.type,
      this.userId
    );
  }

  fail(): Transfer {
    if (!this.status.isPending()) {
      throw new InvalidStateTransitionError(this.status.getValue(), "FAILED");
    }

    return new Transfer(
      this.amount,
      this.date,
      this.description,
      this.id,
      this.recipientId,
      TransferStatus.failed(),
      this.type,
      this.userId
    );
  }

  getAmount(): Amount {
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

  getRecipientId(): string {
    return this.recipientId;
  }

  getStatus(): TransferStatus {
    return this.status;
  }

  getType(): TransferType {
    return this.type;
  }

  getUserId(): string {
    return this.userId;
  }
}
