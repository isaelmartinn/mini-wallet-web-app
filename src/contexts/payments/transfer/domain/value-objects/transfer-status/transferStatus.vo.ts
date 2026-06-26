export enum TransferStatusEnum {
  FAILED = "FAILED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
}

export class TransferStatus {
  private constructor(private readonly value: TransferStatusEnum) {}

  static failed(): TransferStatus {
    return new TransferStatus(TransferStatusEnum.FAILED);
  }

  static pending(): TransferStatus {
    return new TransferStatus(TransferStatusEnum.PENDING);
  }

  static success(): TransferStatus {
    return new TransferStatus(TransferStatusEnum.SUCCESS);
  }

  equals(other: TransferStatus): boolean {
    return this.value === other.value;
  }

  getValue(): TransferStatusEnum {
    return this.value;
  }

  isFailed(): boolean {
    return this.value === TransferStatusEnum.FAILED;
  }

  isPending(): boolean {
    return this.value === TransferStatusEnum.PENDING;
  }

  isSuccess(): boolean {
    return this.value === TransferStatusEnum.SUCCESS;
  }
}
