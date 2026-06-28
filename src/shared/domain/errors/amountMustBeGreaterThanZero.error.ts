import { DomainError } from "@/src/shared/domain/errors/domainError";

export class AmountMustBeGreaterThanZeroError extends DomainError {
  constructor() {
    super(
      "Amount must be greater than zero",
      "AMOUNT_MUST_BE_GREATER_THAN_ZERO"
    );
  }
}
