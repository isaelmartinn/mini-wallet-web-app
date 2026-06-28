import type {
  FormErrorMapper,
  FormErrorMapping,
} from "#shared/infrastructure/ui/error-mapper";

import { DomainError } from "#shared/domain/errors";

export class AuthFormErrorMapper implements FormErrorMapper {
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
      const mapping = AuthFormErrorMapper.FORM_ERROR_MAPPINGS[error.code];

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
}
