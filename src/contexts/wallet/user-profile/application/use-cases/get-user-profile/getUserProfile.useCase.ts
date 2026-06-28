import { WalletRepository } from "#wallet/balance/domain/repositories";
import { UserProfile } from "#wallet/user-profile/domain/entities";

import {
  GetUserProfileParams,
  GetUserProfileUseCase as GetUserProfileUseCaseInterface,
} from "./getUserProfile.interface";

export class GetUserProfileUseCase implements GetUserProfileUseCaseInterface {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(params: GetUserProfileParams): Promise<UserProfile> {
    return await this.walletRepository.getUserProfile(params.userId);
  }
}
