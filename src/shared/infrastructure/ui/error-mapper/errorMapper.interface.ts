import { ErrorPresentation } from "./errorPresentation";
import { FormErrorMapping } from "./formErrorMapping";

export interface ErrorMapper {
  toFormError(error: unknown): FormErrorMapping | null;
  toPresentation(error: unknown): ErrorPresentation | null;
}
