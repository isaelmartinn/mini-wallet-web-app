import { DomainError } from "@/src/shared/domain/errors/domainError";

export class AmountNegativeError extends DomainError {
  constructor() {
    super("Amount cannot be negative", "AMOUNT_NEGATIVE");
  }
}
