import { DomainError } from "#shared/domain/errors";

export class TransferTimeoutError extends DomainError {
  constructor() {
    super("Transfer confirmation timed out", "TRANSFER_TIMEOUT");
  }
}
