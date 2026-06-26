import { DomainError } from "#shared/domain/errors";

export class DuplicateContactNameError extends DomainError {
  constructor() {
    super("Contact with this name already exists", "DUPLICATE_CONTACT_NAME");
  }
}
