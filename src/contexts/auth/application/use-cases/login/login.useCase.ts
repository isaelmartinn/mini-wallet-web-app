import { User } from "#auth/domain/entities";
import { InvalidCredentialsError } from "#auth/domain/errors";
import { AuthRepository } from "#auth/domain/repositories";
import { CredentialFactory } from "#auth/domain/services";

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
