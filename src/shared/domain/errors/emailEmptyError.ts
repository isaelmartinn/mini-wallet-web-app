import { DomainError } from "#shared/domain/errors";

export class EmailEmptyError extends DomainError {
  constructor() {
    super("Email cannot be empty", "EMAIL_EMPTY");
  }
}
