import { Transfer } from "#payments/transfer/domain";

export interface GetTransfersUseCase {
  execute(): Promise<Transfer[]>;
}
