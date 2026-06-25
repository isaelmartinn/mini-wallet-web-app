import { User } from "#auth/domain/entities";
import { AuthRepository } from "#auth/domain/repositories";

import { ValidateSessionUseCase as ValidateSessionUseCaseInterface } from "./validateSession.interface";

export class ValidateSessionUseCase implements ValidateSessionUseCaseInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<null | User> {
    return this.authRepository.getStoredSession();
  }
}
