import { User } from "#auth/session/domain/entities";

export interface ValidateSessionUseCase {
  execute(): Promise<null | User>;
}
