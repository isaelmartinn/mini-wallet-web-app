import { ErrorPresentation } from "./errorPresentation";

/**
 * Interface for error mappers that translate domain errors to toast presentations.
 * Implements the Adapter pattern to convert domain errors to user-facing toast messages.
 */
export interface IPresentationErrorMapper {
  /**
   * Converts an error to a user-facing presentation for toast notifications.
   * @param error - The error to map (can be any type)
   * @returns ErrorPresentation if the mapper can handle this error, null otherwise
   */
  toPresentation(error: unknown): ErrorPresentation | null;
}
