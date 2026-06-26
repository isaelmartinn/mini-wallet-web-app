import { Transfer } from "#payments/transfer/domain/entities";

export interface TransferRepository {
  findAll(): Promise<Transfer[]>;
}
