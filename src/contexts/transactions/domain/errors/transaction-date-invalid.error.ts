import { DomainError } from "#shared/domain/errors";

export class TransactionDateInvalidError extends DomainError {
  constructor() {
    super("Transaction date must be a valid date", "TRANSACTION_DATE_INVALID");
  }
}
