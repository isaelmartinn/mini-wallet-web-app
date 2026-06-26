import { DomainError } from "#shared/domain/errors";

export class DuplicateContactPhoneError extends DomainError {
  constructor() {
    super("Contact with this phone already exists", "DUPLICATE_CONTACT_PHONE");
  }
}
