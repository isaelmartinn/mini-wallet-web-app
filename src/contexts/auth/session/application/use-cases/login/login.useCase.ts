import { User } from "#auth/session/domain/entities";
import { InvalidCredentialsError } from "#auth/session/domain/errors";
import { AuthRepository } from "#auth/session/domain/repositories";
import { CredentialFactory } from "#auth/session/domain/services";

import {
  LoginParams,
  LoginUseCase as LoginUseCaseInterface,
} from "./login.interface";

export class LoginUseCase implements LoginUseCaseInterface {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<User> {
    const credential = CredentialFactory.createFromString(params.credential);

    const user = await this.authRepository.findByCredential(credential);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    return user;
  }
}
