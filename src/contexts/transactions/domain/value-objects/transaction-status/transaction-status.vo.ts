export enum TransactionStatusEnum {
  FAILED = "FAILED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
}

export class TransactionStatus {
  private constructor(private readonly value: TransactionStatusEnum) {}

  static failed(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.FAILED);
  }

  static pending(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.PENDING);
  }

  static success(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.SUCCESS);
  }

  equals(other: TransactionStatus): boolean {
    return this.value === other.value;
  }

  getValue(): TransactionStatusEnum {
    return this.value;
  }

  isFailed(): boolean {
    return this.value === TransactionStatusEnum.FAILED;
  }

  isPending(): boolean {
    return this.value === TransactionStatusEnum.PENDING;
  }

  isSuccess(): boolean {
    return this.value === TransactionStatusEnum.SUCCESS;
  }
}
