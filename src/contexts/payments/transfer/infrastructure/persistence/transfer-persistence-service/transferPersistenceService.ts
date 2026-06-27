import { Transfer } from "#payments/transfer/domain/entities";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { Amount } from "#shared/domain/value-objects";
import { LocalStorageService } from "#shared/infrastructure/storage";

import { TransferPersistenceService as TransferPersistenceServiceInterface } from "./transferPersistenceService.interface";

interface TransferData {
  amount: number;
  date: string;
  description: string;
  id: string;
  recipientId: string;
  status: string;
  type: string;
  userId: string;
}

export class TransferPersistenceService implements TransferPersistenceServiceInterface {
  private static readonly STORAGE_KEY_PREFIX = "payments:transfers";

  constructor(private readonly storageService: LocalStorageService) {}

  clearTransfers(userId: string): void {
    const key = this.getStorageKey(userId);
    this.storageService.remove(key);
  }

  getTransfers(userId: string): null | Transfer[] {
    const key = this.getStorageKey(userId);
    const data = this.storageService.get<TransferData[]>(key);

    if (!data || !Array.isArray(data)) {
      return null;
    }

    try {
      return data.map((transferData) =>
        Transfer.rehydrate({
          amount: Amount.create(transferData.amount),
          date: new Date(transferData.date),
          description: transferData.description,
          id: transferData.id,
          recipientId: transferData.recipientId,
          status: this.deserializeStatus(transferData.status),
          type: this.deserializeType(transferData.type),
          userId: transferData.userId,
        })
      );
    } catch (error) {
      console.error("Error reconstructing Transfers from storage:", error);
      return null;
    }
  }

  saveTransfers(userId: string, transfers: Transfer[]): void {
    const key = this.getStorageKey(userId);
    const data: TransferData[] = transfers.map((transfer) => ({
      amount: transfer.getAmount().getValue(),
      date: transfer.getDate().getValue().toISOString(),
      description: transfer.getDescription(),
      id: transfer.getId(),
      recipientId: transfer.getRecipientId(),
      status: transfer.getStatus().getValue(),
      type: transfer.getType().getValue(),
      userId: transfer.getUserId(),
    }));

    this.storageService.set(key, data);
  }

  private deserializeStatus(status: string): TransferStatus {
    switch (status.toUpperCase()) {
      case "FAILED":
        return TransferStatus.failed();
      case "PENDING":
        return TransferStatus.pending();
      case "SUCCESS":
        return TransferStatus.success();
      default:
        return TransferStatus.pending();
    }
  }

  private deserializeType(type: string): TransferType {
    switch (type.toUpperCase()) {
      case "EXPENSE":
        return TransferType.expense();
      case "INCOME":
        return TransferType.income();
      default:
        return TransferType.expense();
    }
  }

  private getStorageKey(userId: string): string {
    return `${TransferPersistenceService.STORAGE_KEY_PREFIX}:${userId}`;
  }
}
