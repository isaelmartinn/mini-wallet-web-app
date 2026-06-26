import { DomainError } from "#shared/domain/errors";

export class TransferFetchFailedError extends DomainError {
  constructor() {
    super(
      "Failed to fetch transfers from repository",
      "TRANSACTION_FETCH_FAILED"
    );
  }
}
