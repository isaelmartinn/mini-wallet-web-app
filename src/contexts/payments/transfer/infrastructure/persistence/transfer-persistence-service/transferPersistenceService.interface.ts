import { Transfer } from "#payments/transfer/domain/entities";

export interface TransferPersistenceService {
  clearTransfers(userId: string): void;
  getTransfers(userId: string): null | Transfer[];
  saveTransfers(userId: string, transfers: Transfer[]): void;
}
