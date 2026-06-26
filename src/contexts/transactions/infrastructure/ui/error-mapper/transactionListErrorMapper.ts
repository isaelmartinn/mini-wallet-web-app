import { DomainError } from "#shared/domain/errors";
import {
  ErrorMapper,
  ErrorPresentation,
  FormErrorMapping,
} from "#shared/infrastructure/ui/error-mapper";

export class TransactionListErrorMapper implements ErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    TRANSACTION_DATE_INVALID: {
      description: "La fecha de la transacción no es válida",
      title: "Fecha inválida",
    },
    TRANSACTION_FETCH_FAILED: {
      description:
        "No se pudieron cargar las transacciones. Por favor, intenta nuevamente",
      title: "Error al cargar transacciones",
    },
  };

  toFormError(_error: unknown): FormErrorMapping | null {
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation =
        TransactionListErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation;
      }

      return {
        description: error.message,
        title: "Error de validación",
      };
    }

    return null;
  }
}
