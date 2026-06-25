import { DomainError } from "#shared/domain/errors";

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS");
  }
}
