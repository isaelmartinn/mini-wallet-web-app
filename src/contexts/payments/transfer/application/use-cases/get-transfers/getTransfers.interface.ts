import { Transfer } from "#payments/transfer/domain";

export interface GetTransfersParams {
  userId: string;
}

export interface GetTransfersUseCase {
  execute(params: GetTransfersParams): Promise<Transfer[]>;
}
