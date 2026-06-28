import { DomainError } from "#shared/domain/errors";

import { TransferErrorType } from "../config/errorStates.config";

const ERROR_CODE_TO_TYPE_MAP: Record<string, TransferErrorType> = {
  INSUFFICIENT_BALANCE: "INSUFFICIENT_FUNDS",
  TRANSFER_NETWORK_ERROR: "NETWORK_ERROR",
  TRANSFER_TIMEOUT: "TIMEOUT",
};

export function mapDomainErrorToType(error: unknown): TransferErrorType {
  if (error instanceof DomainError) {
    return ERROR_CODE_TO_TYPE_MAP[error.code] ?? "UNKNOWN_ERROR";
  }

  return "UNKNOWN_ERROR";
}
