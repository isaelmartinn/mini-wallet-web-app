import { FormErrorMapping } from "./formErrorMapping";

export interface FormErrorMapper {
  toFormError(error: unknown): FormErrorMapping | null;
}
