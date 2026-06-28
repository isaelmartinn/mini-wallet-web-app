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
  TransferAmount,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain/value-objects";
import { TransferPersistenceService } from "#payments/transfer/infrastructure/persistence";
import { TRANSACTION_FIXTURES } from "#payments/transfer/infrastructure/repositories/transfer-repository/transfer.fixtures";
import { HttpClient, HttpError } from "#shared/infrastructure";
import { MockTransactionData } from "#shared/infrastructure/mocks";
import { LocalStorageService } from "#shared/infrastructure/storage";

interface ConfirmTransferResponse {
  success: boolean;
  transfer: MockTransactionData;
}

export class TransferRepositoryImpl implements TransferRepository {
  private static instance: TransferRepositoryImpl;
  private static persistenceService: TransferPersistenceService;
  private static transfersByUser: Map<string, Transfer[]> = new Map();
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();

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
    try {
      const response = await this.httpClient.post<ConfirmTransferResponse>(
        `/api/transfers/${transferId}/confirm`,
        {}
      );

      const confirmedTransfer = this.mapToTransfer(response.transfer);

      const userId = confirmedTransfer.getUserId();
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
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 400) {
          const body = error.body as { error?: string };
          if (body?.error === "INSUFFICIENT_FUNDS") {
            throw new InsufficientBalanceError();
          }
        }
        if (error.status === 500) {
          const body = error.body as { error?: string };
          if (body?.error === "NETWORK_ERROR") {
            throw new TransferNetworkError();
          }
          if (body?.error === "UNKNOWN_ERROR") {
            throw new TransferUnknownError();
          }
        }
        if (error.status === 504) {
          throw new TransferTimeoutError();
        }
      }
      throw error;
    }
  }

  async create(params: CreateTransferParams): Promise<Transfer> {
    const response = await this.httpClient.post<MockTransactionData>(
      "/api/transfers",
      {
        amount: params.amount.getValue(),
        description: params.description,
        recipientId: params.recipientId,
        userId: params.userId,
      }
    );

    const newTransfer = this.mapToTransfer(response);

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
    for (const transfers of TransferRepositoryImpl.transfersByUser.values()) {
      const transfer = transfers.find((t) => t.getId() === transferId);
      if (transfer) {
        return transfer;
      }
    }

    try {
      const response = await this.httpClient.get<MockTransactionData>(
        `/api/transfers/${transferId}`
      );
      return this.mapToTransfer(response);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
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

    try {
      const response = await this.httpClient.get<MockTransactionData[]>(
        `/api/transfers?userId=${userId}`
      );

      const transfers = response.map((data) => this.mapToTransfer(data));

      TransferRepositoryImpl.transfersByUser.set(userId, transfers);
      TransferRepositoryImpl.persistenceService.saveTransfers(
        userId,
        transfers
      );

      return transfers;
    } catch (error) {
      if (error instanceof HttpError && error.status === 500) {
        throw new TransferFetchFailedError();
      }
      throw error;
    }
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

  private mapToTransfer(data: MockTransactionData): Transfer {
    return Transfer.create({
      amount: TransferAmount.create(data.amount),
      date: new Date(data.date),
      description: data.description,
      id: data.id,
      recipientId: data.recipientId,
      status:
        data.status === "success"
          ? TransferStatus.success()
          : data.status === "failed"
            ? TransferStatus.failed()
            : TransferStatus.pending(),
      type:
        data.type === "income" ? TransferType.income() : TransferType.expense(),
      userId: data.userId,
    });
  }
}
