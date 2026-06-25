import { DomainError } from "#shared/domain/errors";

export class EmailInvalidFormatError extends DomainError {
  constructor() {
    super("Invalid email format", "EMAIL_INVALID_FORMAT");
  }
}
