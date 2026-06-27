import { DomainError } from "#shared/domain/errors";

export class InvalidDescriptionError extends DomainError {
  constructor() {
    super("Description cannot be empty", "INVALID_DESCRIPTION");
  }
}
