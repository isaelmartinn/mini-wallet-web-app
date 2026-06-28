import { ErrorPresentation } from "./errorPresentation";

export interface PresentationErrorMapper {
  toPresentation(error: unknown): ErrorPresentation | null;
}
