import { DomainError } from "#shared/domain/errors";
import {
  ErrorPresentation,
  FormErrorMapper,
  FormErrorMapping,
  PresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

export class TransactionFormErrorMapper
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
    INVALID_AMOUNT: {
      description: "El monto debe ser mayor a cero",
      title: "Monto inválido",
    },
    RECIPIENT_REQUIRED: {
      description: "Debes seleccionar un destinatario para la transacción",
      title: "Destinatario requerido",
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
    INVALID_AMOUNT: {
      fieldName: "amount",
      message: "El monto debe ser mayor a cero",
    },
    RECIPIENT_REQUIRED: {
      fieldName: "recipientId",
      message: "Debes seleccionar un destinatario",
    },
  };

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      return (
        TransactionFormErrorMapper.FORM_ERROR_MAPPINGS[error.code] || {
          fieldName: "amount",
          message: error.message,
        }
      );
    }
    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation =
        TransactionFormErrorMapper.ERROR_MESSAGES[error.code];

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
