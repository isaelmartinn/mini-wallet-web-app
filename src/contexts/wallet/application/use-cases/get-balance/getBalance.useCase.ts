import { Balance } from "#wallet/domain/entities";
import { WalletRepository } from "#wallet/domain/repositories";

import {
  GetBalanceParams,
  GetBalanceUseCase as GetBalanceUseCaseInterface,
} from "./getBalance.interface";

export class GetBalanceUseCase implements GetBalanceUseCaseInterface {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(params: GetBalanceParams): Promise<Balance> {
    return await this.walletRepository.getBalance(params.userId);
  }
}
