import { DomainError } from "#shared/domain/errors";

export class PhoneInvalidFormatError extends DomainError {
  constructor() {
    super("Invalid phone format", "PHONE_INVALID_FORMAT");
  }
}
