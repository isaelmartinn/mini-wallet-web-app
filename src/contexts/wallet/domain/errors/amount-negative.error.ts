import { DomainError } from "#shared/domain/errors";

export class AmountNegativeError extends DomainError {
  constructor() {
    super("Amount cannot be negative", "AMOUNT_NEGATIVE");
  }
}
