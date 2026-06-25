import { useCallback } from "react";
import { sileo } from "sileo";

import type { ErrorPresentation, IErrorMapper } from "../error-mapper";

/**
 * Hook for handling errors using a chain of responsibility pattern.
 * Accepts an array of error mappers and tries each one until a match is found.
 * Falls back to a generic error message if no mapper handles the error.
 *
 * @param mappers - Array of error mappers to try in order
 * @returns Object with handleError function
 */
export function useErrorHandler(mappers: IErrorMapper[] = []) {
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
