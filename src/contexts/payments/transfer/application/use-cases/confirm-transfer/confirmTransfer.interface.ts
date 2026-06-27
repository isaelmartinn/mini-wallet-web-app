import { Transfer } from "#payments/transfer/domain/entities";

export interface ConfirmTransferParams {
  amount: number;
  transferId: string;
  userId: string;
}

export interface ConfirmTransferUseCase {
  execute(params: ConfirmTransferParams): Promise<Transfer>;
}
