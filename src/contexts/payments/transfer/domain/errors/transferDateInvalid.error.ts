import { DomainError } from "#shared/domain/errors";

export class TransferDateInvalidError extends DomainError {
  constructor() {
    super("Transfer date must be a valid date", "TRANSACTION_DATE_INVALID");
  }
}
