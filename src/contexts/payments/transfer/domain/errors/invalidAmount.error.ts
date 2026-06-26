import { DomainError } from "#shared/domain/errors";

export class InvalidAmountError extends DomainError {
  constructor() {
    super("Amount must be greater than zero", "INVALID_AMOUNT");
  }
}
