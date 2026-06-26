import { DomainError } from "#shared/domain/errors";

export class DuplicateContactEmailError extends DomainError {
  constructor() {
    super("Contact with this email already exists", "DUPLICATE_CONTACT_EMAIL");
  }
}
