import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { useCallback } from "react";
import { sileo } from "sileo";

import type {
  ErrorPresentation,
  IFormErrorMapper,
  IPresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

interface UseFormErrorHandlerOptions<TFieldValues extends FieldValues> {
  form: {
    setError: UseFormSetError<TFieldValues>;
  };
  formErrorMappers?: IFormErrorMapper[];
  presentationMappers?: IPresentationErrorMapper[];
  showToast?: boolean;
}

export function useFormErrorHandler<TFieldValues extends FieldValues>({
  form,
  formErrorMappers = [],
  presentationMappers = [],
  showToast = true,
}: UseFormErrorHandlerOptions<TFieldValues>) {
  const handleError = useCallback(
    (error: unknown) => {
      let presentation: ErrorPresentation | null = null;
      let formErrorMapping = null;

      for (const mapper of presentationMappers) {
        presentation = mapper.toPresentation(error);
        if (presentation) break;
      }

      for (const mapper of formErrorMappers) {
        formErrorMapping = mapper.toFormError(error);
        if (formErrorMapping) break;
      }

      if (showToast) {
        const toastPresentation = presentation || {
          description: "Por favor, intenta nuevamente",
          title: "Error inesperado",
        };

        sileo.error({
          description: toastPresentation.description,
          title: toastPresentation.title,
        });
      }

      if (formErrorMapping) {
        form.setError(formErrorMapping.fieldName as Path<TFieldValues>, {
          message: formErrorMapping.message,
          type: "manual",
        });
      }
    },
    [form, formErrorMappers, presentationMappers, showToast]
  );

  return { handleError };
}
