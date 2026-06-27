import { DomainError } from "@/src/shared/domain/errors/domainError";

export class AmountInvalidError extends DomainError {
  constructor() {
    super("Amount must be a valid number", "AMOUNT_INVALID");
  }
}
