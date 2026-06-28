import { AuthRepository } from "#auth/domain/repositories";

import { LogoutUseCase as LogoutUseCaseInterface } from "./logout.interface";

export class LogoutUseCase implements LogoutUseCaseInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.clearSession();
  }
}
