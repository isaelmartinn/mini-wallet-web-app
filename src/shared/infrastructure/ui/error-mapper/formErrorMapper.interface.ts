import { FormErrorMapping } from "./formErrorMapping";

/**
 * Interface for error mappers that translate domain errors to form field errors.
 * Implements the Adapter pattern to convert domain errors to inline form error messages.
 */
export interface FormErrorMapper {
  /**
   * Converts an error to a form field error mapping.
   * @param error - The error to map (can be any type)
   * @returns FormErrorMapping if the mapper can handle this error, null otherwise
   */
  toFormError(error: unknown): FormErrorMapping | null;
}
