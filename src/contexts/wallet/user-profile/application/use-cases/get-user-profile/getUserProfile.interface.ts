import { UserProfile } from "#wallet/user-profile/domain/entities";

export interface GetUserProfileParams {
  userId: string;
}

export interface GetUserProfileUseCase {
  execute(params: GetUserProfileParams): Promise<UserProfile>;
}
