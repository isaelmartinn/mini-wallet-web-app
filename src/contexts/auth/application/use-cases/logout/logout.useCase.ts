import { LogoutUseCase as LogoutUseCaseInterface } from "./logout.interface";

export class LogoutUseCase implements LogoutUseCaseInterface {
  async execute(): Promise<void> {
    return Promise.resolve();
  }
}
