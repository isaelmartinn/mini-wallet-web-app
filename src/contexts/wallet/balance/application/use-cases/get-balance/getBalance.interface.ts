import { Balance } from "#wallet/balance/domain/entities";

export interface GetBalanceParams {
  userId: string;
}

export interface GetBalanceUseCase {
  execute(params: GetBalanceParams): Promise<Balance>;
}
