import { DomainError } from "#shared/domain/errors";

export class TransferAmountMustBeGreaterThanZeroError extends DomainError {
  constructor() {
    super(
      "Transfer amount must be greater than zero",
      "TRANSFER_AMOUNT_MUST_BE_GREATER_THAN_ZERO"
    );
  }
}
