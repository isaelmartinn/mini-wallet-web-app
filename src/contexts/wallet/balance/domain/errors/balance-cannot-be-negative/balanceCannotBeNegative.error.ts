import { DomainError } from "#shared/domain/errors";

export class BalanceCannotBeNegativeError extends DomainError {
  constructor() {
    super("Balance cannot be negative", "BALANCE_CANNOT_BE_NEGATIVE");
  }
}
