import { Balance } from "#wallet/balance/domain/entities";
import { WalletRepository } from "#wallet/balance/domain/repositories";

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
