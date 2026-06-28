import { User } from "#auth/session/domain/entities";
import { AuthRepository } from "#auth/session/domain/repositories";

import { ValidateSessionUseCase as ValidateSessionUseCaseInterface } from "./validateSession.interface";

export class ValidateSessionUseCase implements ValidateSessionUseCaseInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<null | User> {
    return this.authRepository.getStoredSession();
  }
}
