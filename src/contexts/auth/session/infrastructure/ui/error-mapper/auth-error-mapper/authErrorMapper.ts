import type {
  ErrorPresentation,
  PresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

import { DomainError } from "#shared/domain/errors";

export class AuthErrorMapper implements PresentationErrorMapper {
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
