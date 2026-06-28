import { MockTransactionData } from "#shared/infrastructure/mocks";

/**
 * In-memory storage for dynamically created transfers
 * This simulates a database for the mock API
 */
class TransfersStorage {
  private transfers: Map<string, MockTransactionData> = new Map();

  clear(): void {
    this.transfers.clear();
  }

  delete(transferId: string): boolean {
    return this.transfers.delete(transferId);
  }

  get(transferId: string): MockTransactionData | undefined {
    return this.transfers.get(transferId);
  }

  getAll(): MockTransactionData[] {
    return Array.from(this.transfers.values());
  }

  set(transferId: string, transfer: MockTransactionData): void {
    this.transfers.set(transferId, transfer);
  }

  update(transferId: string, transfer: MockTransactionData): void {
    this.transfers.set(transferId, transfer);
  }
}

// Singleton instance - persists across API requests
export const transfersStorage = new TransfersStorage();
