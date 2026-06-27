import { DomainError } from "#shared/domain/errors";

export class TransferNetworkError extends DomainError {
  constructor() {
    super(
      "Network error during transfer confirmation",
      "TRANSFER_NETWORK_ERROR"
    );
  }
}
