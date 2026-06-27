import { DomainError } from "#shared/domain/errors";
import {
  ErrorMapper,
  ErrorPresentation,
  FormErrorMapping,
} from "#shared/infrastructure/ui/error-mapper";

export class TransferConfirmErrorMapper implements ErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    INSUFFICIENT_BALANCE: {
      description:
        "No tienes saldo suficiente para completar esta transferencia",
      title: "Saldo insuficiente",
    },
    TRANSACTION_FETCH_FAILED: {
      description:
        "No se pudo encontrar la transferencia. Por favor, intenta nuevamente",
      title: "Transferencia no encontrada",
    },
    TRANSFER_NETWORK_ERROR: {
      description:
        "Hubo un problema de conexión. Por favor, verifica tu internet e intenta nuevamente",
      title: "Error de conexión",
    },
    TRANSFER_TIMEOUT: {
      description:
        "La transferencia tardó demasiado en procesarse. Por favor, intenta nuevamente",
      title: "Tiempo de espera agotado",
    },
    TRANSFER_UNKNOWN_ERROR: {
      description:
        "Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde",
      title: "Error desconocido",
    },
  };

  toFormError(_error: unknown): FormErrorMapping | null {
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation =
        TransferConfirmErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation;
      }

      console.error(
        `[TransferConfirmErrorMapper] Unmapped error code: ${error.code}`,
        error
      );

      return {
        description:
          "Ocurrió un problema al confirmar la transferencia. Por favor, intenta nuevamente.",
        title: "Error inesperado",
      };
    }

    return null;
  }
}
