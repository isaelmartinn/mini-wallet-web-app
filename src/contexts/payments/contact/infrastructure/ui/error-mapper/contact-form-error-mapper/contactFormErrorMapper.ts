import type {
  FormErrorMapper,
  FormErrorMapping,
} from "#shared/infrastructure/ui/error-mapper";

import { DomainError } from "#shared/domain/errors";

export class ContactFormErrorMapper implements FormErrorMapper {
  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    CONTACT_NAME_EMPTY: {
      fieldName: "name",
      message: "El nombre no puede estar vacío",
    },
    DUPLICATE_CONTACT_EMAIL: {
      fieldName: "email",
      message: "Ya existe un contacto con este email",
    },
    DUPLICATE_CONTACT_NAME: {
      fieldName: "name",
      message: "Ya existe un contacto con este nombre",
    },
    DUPLICATE_CONTACT_PHONE: {
      fieldName: "phone",
      message: "Ya existe un contacto con este teléfono",
    },
    EMAIL_EMPTY: {
      fieldName: "email",
      message: "El email no puede estar vacío",
    },
    EMAIL_INVALID_FORMAT: {
      fieldName: "email",
      message: "El formato del email no es válido",
    },
    PHONE_EMPTY: {
      fieldName: "phone",
      message: "El teléfono no puede estar vacío",
    },
    PHONE_INVALID_COUNTRY_CODE: {
      fieldName: "phone",
      message: "Debe comenzar con +52",
    },
    PHONE_INVALID_FORMAT: {
      fieldName: "phone",
      message: "Formato inválido. Usa +52 seguido de 10 dígitos",
    },
  };

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      const mapping = ContactFormErrorMapper.FORM_ERROR_MAPPINGS[error.code];

      if (mapping) {
        return mapping;
      }

      return {
        fieldName: "name",
        message: error.message,
      };
    }

    return null;
  }
}
