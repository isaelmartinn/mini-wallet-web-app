import { DomainError } from "#shared/domain/errors";
import {
  ErrorPresentation,
  FormErrorMapper,
  FormErrorMapping,
  PresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

export class TransferFormErrorMapper
  implements FormErrorMapper, PresentationErrorMapper
{
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    CONTACT_EMAIL_EMPTY: {
      description: "El email del contacto no puede estar vacío",
      title: "Email vacío",
    },
    CONTACT_NAME_EMPTY: {
      description: "El nombre del contacto no puede estar vacío",
      title: "Nombre vacío",
    },
    CONTACT_PHONE_EMPTY: {
      description: "El teléfono del contacto no puede estar vacío",
      title: "Teléfono vacío",
    },
    INSUFFICIENT_BALANCE: {
      description: "No tienes saldo suficiente para realizar esta transacción",
      title: "Saldo insuficiente",
    },
    RECIPIENT_REQUIRED: {
      description: "Debes seleccionar un destinatario para la transacción",
      title: "Destinatario requerido",
    },
    TRANSFER_AMOUNT_MUST_BE_GREATER_THAN_ZERO: {
      description: "El monto debe ser mayor a cero",
      title: "Monto inválido",
    },
  };

  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    CONTACT_EMAIL_EMPTY: {
      fieldName: "email",
      message: "El email no puede estar vacío",
    },
    CONTACT_NAME_EMPTY: {
      fieldName: "name",
      message: "El nombre no puede estar vacío",
    },
    CONTACT_PHONE_EMPTY: {
      fieldName: "phone",
      message: "El teléfono no puede estar vacío",
    },
    INSUFFICIENT_BALANCE: {
      fieldName: "amount",
      message: "No tienes saldo suficiente",
    },
    RECIPIENT_REQUIRED: {
      fieldName: "recipientId",
      message: "Debes seleccionar un destinatario",
    },
    TRANSFER_AMOUNT_MUST_BE_GREATER_THAN_ZERO: {
      fieldName: "amount",
      message: "El monto debe ser mayor a cero",
    },
  };

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      const formError = TransferFormErrorMapper.FORM_ERROR_MAPPINGS[error.code];

      if (formError) {
        return formError;
      }

      console.error(
        `[TransferFormErrorMapper] Unmapped form error code: ${error.code}`,
        error
      );

      return {
        fieldName: "amount",
        message:
          "Ocurrió un error de validación. Por favor, verifica los datos.",
      };
    }
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation = TransferFormErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation;
      }

      console.error(
        `[TransferFormErrorMapper] Unmapped error code: ${error.code}`,
        error
      );

      return {
        description:
          "Ocurrió un error de validación. Por favor, verifica los datos e intenta nuevamente.",
        title: "Error de validación",
      };
    }

    return null;
  }
}
