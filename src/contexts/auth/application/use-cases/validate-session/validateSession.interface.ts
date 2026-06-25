import { User } from "#auth/domain/entities";

export interface ValidateSessionUseCase {
  execute(): Promise<null | User>;
}
