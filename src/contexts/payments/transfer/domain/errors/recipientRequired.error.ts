import { DomainError } from "#shared/domain/errors";

export class RecipientRequiredError extends DomainError {
  constructor() {
    super("Recipient is required for transaction", "RECIPIENT_REQUIRED");
  }
}
