import { DomainError } from "#shared/domain/errors";

export class AmountInvalidError extends DomainError {
  constructor() {
    super("Amount must be a valid number", "AMOUNT_INVALID");
  }
}
