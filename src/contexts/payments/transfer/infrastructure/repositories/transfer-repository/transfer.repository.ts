import { Transfer, TransferRepository } from "#payments/transfer/domain";
import {
  InsufficientBalanceError,
  TransferFetchFailedError,
  TransferNetworkError,
  TransferTimeoutError,
  TransferUnknownError,
} from "#payments/transfer/domain/errors";
import {
  ConfirmTransferResult,
  CreateTransferParams,
} from "#payments/transfer/domain/repositories";
import {
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { TransferPersistenceService } from "#payments/transfer/infrastructure/persistence";
import { TRANSACTION_FIXTURES } from "#payments/transfer/infrastructure/repositories/transfer-repository/transfer.fixtures";
import { MOCK_CONFIG } from "#shared/infrastructure/config/mock.config";
import { LocalStorageService } from "#shared/infrastructure/storage";

export class TransferRepositoryImpl implements TransferRepository {
  private static instance: TransferRepositoryImpl;
  private static persistenceService: TransferPersistenceService;
  private static transfersByUser: Map<string, Transfer[]> = new Map();

  constructor() {
    if (TransferRepositoryImpl.instance) {
      return TransferRepositoryImpl.instance;
    }

    if (!TransferRepositoryImpl.persistenceService) {
      const storageService = new LocalStorageService();
      TransferRepositoryImpl.persistenceService =
        new TransferPersistenceService(storageService);
    }

    TransferRepositoryImpl.instance = this;
    this.initializeFixtures();
  }

  async confirm(transferId: string): Promise<ConfirmTransferResult> {
    const { delays, errorRates } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const transfer = await this.findById(transferId);

    if (!transfer) {
      throw new TransferFetchFailedError();
    }

    if (transfer.getStatus().isSuccess()) {
      return { success: true, transfer };
    }

    const random = Math.random();
    const scenarios = errorRates.transfers.confirmTransfer;

    let cumulative = 0;

    cumulative += scenarios.SUCCESS;
    if (random < cumulative) {
      const confirmedTransfer = transfer.confirm();

      const userId = transfer.getUserId();
      const userTransfers =
        TransferRepositoryImpl.transfersByUser.get(userId) || [];
      const transferIndex = userTransfers.findIndex(
        (t) => t.getId() === transferId
      );

      if (transferIndex !== -1) {
        userTransfers[transferIndex] = confirmedTransfer;
        TransferRepositoryImpl.transfersByUser.set(userId, userTransfers);
        TransferRepositoryImpl.persistenceService.saveTransfers(
          userId,
          userTransfers
        );
      }

      return { success: true, transfer: confirmedTransfer };
    }

    cumulative += scenarios.NETWORK_ERROR;
    if (random < cumulative) {
      throw new TransferNetworkError();
    }

    cumulative += scenarios.INSUFFICIENT_FUNDS;
    if (random < cumulative) {
      throw new InsufficientBalanceError();
    }

    cumulative += scenarios.TIMEOUT;
    if (random < cumulative) {
      throw new TransferTimeoutError();
    }

    throw new TransferUnknownError();
  }

  async create(params: CreateTransferParams): Promise<Transfer> {
    const { delays } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newTransfer = Transfer.create({
      amount: params.amount,
      date: new Date(),
      description: params.description,
      id: transferId,
      recipientId: params.recipientId,
      status: TransferStatus.pending(),
      type: TransferType.expense(),
      userId: params.userId,
    });

    const userTransfers =
      TransferRepositoryImpl.transfersByUser.get(params.userId) || [];
    userTransfers.push(newTransfer);
    TransferRepositoryImpl.transfersByUser.set(params.userId, userTransfers);
    TransferRepositoryImpl.persistenceService.saveTransfers(
      params.userId,
      userTransfers
    );

    return newTransfer;
  }

  async findById(transferId: string): Promise<null | Transfer> {
    const { delays } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    for (const transfers of TransferRepositoryImpl.transfersByUser.values()) {
      const transfer = transfers.find((t) => t.getId() === transferId);
      if (transfer) {
        return transfer;
      }
    }

    return null;
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    const { delays, errorRates } = MOCK_CONFIG;
    const delay = Math.random() * (delays.max - delays.min) + delays.min;

    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail =
      Math.random() > errorRates.transfers.getTransfers.SUCCESS;

    if (shouldFail) {
      throw new TransferFetchFailedError();
    }

    const cachedTransfers = TransferRepositoryImpl.transfersByUser.get(userId);
    if (cachedTransfers && cachedTransfers.length > 0) {
      return [...cachedTransfers];
    }

    const persistedTransfers =
      TransferRepositoryImpl.persistenceService.getTransfers(userId);
    if (persistedTransfers && persistedTransfers.length > 0) {
      TransferRepositoryImpl.transfersByUser.set(userId, persistedTransfers);
      return [...persistedTransfers];
    }

    return [];
  }

  private initializeFixtures(): void {
    if (TransferRepositoryImpl.transfersByUser.size > 0) {
      return;
    }

    const userIds = Array.from(
      new Set(TRANSACTION_FIXTURES.map((t) => t.getUserId()))
    );

    userIds.forEach((userId) => {
      const persistedTransfers =
        TransferRepositoryImpl.persistenceService.getTransfers(userId);
      if (persistedTransfers && persistedTransfers.length > 0) {
        TransferRepositoryImpl.transfersByUser.set(userId, persistedTransfers);
        return;
      }

      const userFixtures = TRANSACTION_FIXTURES.filter(
        (t) => t.getUserId() === userId
      );
      TransferRepositoryImpl.transfersByUser.set(userId, userFixtures);
      TransferRepositoryImpl.persistenceService.saveTransfers(
        userId,
        userFixtures
      );
    });
  }
}
