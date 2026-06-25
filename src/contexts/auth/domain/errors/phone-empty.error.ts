import { DomainError } from "#shared/domain/errors";

export class PhoneEmptyError extends DomainError {
  constructor() {
    super("Phone cannot be empty", "PHONE_EMPTY");
  }
}
