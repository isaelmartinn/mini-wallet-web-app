import { useCallback } from "react";
import { sileo } from "sileo";

import type {
  ErrorPresentation,
  PresentationErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

export function useErrorHandler(mappers: PresentationErrorMapper[] = []) {
  const handleError = useCallback(
    (error: unknown) => {
      let presentation: ErrorPresentation | null = null;

      for (const mapper of mappers) {
        presentation = mapper.toPresentation(error);
        if (presentation) break;
      }

      if (!presentation) {
        presentation = {
          description: "Por favor, intenta nuevamente",
          title: "Error inesperado",
        };
      }

      sileo.error({
        description: presentation.description,
        title: presentation.title,
      });
    },
    [mappers]
  );

  return { handleError };
}
