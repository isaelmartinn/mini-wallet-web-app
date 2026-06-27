import { DomainError } from "#shared/domain/errors";

export class TransferUnknownError extends DomainError {
  constructor() {
    super(
      "Unknown error during transfer confirmation",
      "TRANSFER_UNKNOWN_ERROR"
    );
  }
}
