import { DomainError } from "#shared/domain/errors";

export class InsufficientBalanceError extends DomainError {
  constructor() {
    super("Insufficient balance for this transaction", "INSUFFICIENT_BALANCE");
  }
}
