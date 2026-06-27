import { DomainError } from "#shared/domain/errors";
import {
  ErrorMapper,
  ErrorPresentation,
  FormErrorMapping,
} from "#shared/infrastructure/ui/error-mapper";

export class TransferListErrorMapper implements ErrorMapper {
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
      const presentation = TransferListErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation;
      }

      console.error(
        `[TransferListErrorMapper] Unmapped error code: ${error.code}`,
        error
      );

      return {
        description:
          "Ocurrió un problema. Por favor, intenta nuevamente o contacta a soporte.",
        title: "Error inesperado",
      };
    }

    return null;
  }
}
