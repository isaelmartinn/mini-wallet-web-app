import { User } from "#auth/domain/entities";

export interface LoginParams {
  credential: string;
}

export interface LoginUseCase {
  execute(params: LoginParams): Promise<User>;
}
