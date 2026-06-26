export interface PrepareTransferParams {
  amount: number;
  recipientId: string;
  userId: string;
}

export interface PrepareTransferResult {
  amount: number;
  recipientId: string;
  userId: string;
}

export interface PrepareTransferUseCase {
  execute(params: PrepareTransferParams): Promise<PrepareTransferResult>;
}
