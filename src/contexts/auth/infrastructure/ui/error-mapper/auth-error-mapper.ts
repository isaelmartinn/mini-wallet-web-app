import type {
  ErrorPresentation,
  FormErrorMapping,
  IErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

import { DomainError } from "#shared/domain/errors";

/**
 * Auth context error mapper.
 * Translates auth domain errors to user-facing Spanish messages.
 * Implements the Registry pattern for error code to presentation mapping.
 */
export class AuthErrorMapper implements IErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    EMAIL_EMPTY: {
      description: "El email no puede estar vacío",
      title: "Email vacío",
    },
    EMAIL_INVALID_FORMAT: {
      description: "El formato del email no es válido",
      title: "Email inválido",
    },
    INVALID_CREDENTIALS: {
      description: "Verifica tus credenciales e intenta nuevamente",
      title: "Credenciales inválidas",
    },
    PHONE_EMPTY: {
      description: "El teléfono no puede estar vacío",
      title: "Teléfono vacío",
    },
    PHONE_INVALID_COUNTRY_CODE: {
      description: "El teléfono debe comenzar con +52",
      title: "Código de país inválido",
    },
    PHONE_INVALID_FORMAT: {
      description:
        "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
      title: "Teléfono inválido",
    },
  };

  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    EMAIL_EMPTY: {
      fieldName: "credential",
      message: "El email no puede estar vacío",
    },
    EMAIL_INVALID_FORMAT: {
      fieldName: "credential",
      message: "El formato del email no es válido",
    },
    INVALID_CREDENTIALS: {
      fieldName: "credential",
      message: "Credenciales inválidas",
    },
    PHONE_EMPTY: {
      fieldName: "credential",
      message: "El teléfono no puede estar vacío",
    },
    PHONE_INVALID_COUNTRY_CODE: {
      fieldName: "credential",
      message: "El teléfono debe comenzar con +52",
    },
    PHONE_INVALID_FORMAT: {
      fieldName: "credential",
      message:
        "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
    },
  };

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      const mapping = AuthErrorMapper.FORM_ERROR_MAPPINGS[error.code];

      if (mapping) {
        return mapping;
      }

      return {
        fieldName: "credential",
        message: error.message,
      };
    }

    return null;
  }

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation = AuthErrorMapper.ERROR_MESSAGES[error.code];

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
