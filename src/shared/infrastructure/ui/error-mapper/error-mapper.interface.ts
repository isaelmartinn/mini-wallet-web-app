import { ErrorPresentation } from "./error-presentation";
import { FormErrorMapping } from "./form-error-mapping";

/**
 * Interface for error mappers that translate domain errors to UI presentations.
 * Implements the Adapter pattern to convert domain errors to user-facing messages.
 */
export interface IErrorMapper {
  /**
   * Converts an error to a form field error mapping.
   * @param error - The error to map (can be any type)
   * @returns FormErrorMapping if the mapper can handle this error, null otherwise
   */
  toFormError(error: unknown): FormErrorMapping | null;

  /**
   * Converts an error to a user-facing presentation.
   * @param error - The error to map (can be any type)
   * @returns ErrorPresentation if the mapper can handle this error, null otherwise
   */
  toPresentation(error: unknown): ErrorPresentation | null;
}
