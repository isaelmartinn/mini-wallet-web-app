import { DomainError } from "#shared/domain/errors";

export class ContactNameEmptyError extends DomainError {
  constructor() {
    super("Contact name cannot be empty", "CONTACT_NAME_EMPTY");
  }
}
