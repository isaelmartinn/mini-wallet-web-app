import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { useCallback } from "react";
import { sileo } from "sileo";

import type { ErrorPresentation, IErrorMapper } from "../error-mapper";

interface UseFormErrorHandlerOptions<TFieldValues extends FieldValues> {
  form: {
    setError: UseFormSetError<TFieldValues>;
  };
  mappers: IErrorMapper[];
  showToast?: boolean;
}

export function useFormErrorHandler<TFieldValues extends FieldValues>({
  form,
  mappers,
  showToast = true,
}: UseFormErrorHandlerOptions<TFieldValues>) {
  const handleError = useCallback(
    (error: unknown) => {
      let presentation: ErrorPresentation | null = null;
      let formErrorMapping = null;

      for (const mapper of mappers) {
        presentation = mapper.toPresentation(error);
        formErrorMapping = mapper.toFormError(error);

        if (presentation || formErrorMapping) break;
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
    [form, mappers, showToast]
  );

  return { handleError };
}
