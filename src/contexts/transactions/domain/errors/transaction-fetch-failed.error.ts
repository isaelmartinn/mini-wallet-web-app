import { DomainError } from "#shared/domain/errors";

export class TransactionFetchFailedError extends DomainError {
  constructor() {
    super(
      "Failed to fetch transactions from repository",
      "TRANSACTION_FETCH_FAILED"
    );
  }
}
