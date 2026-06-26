export interface PrepareTransactionParams {
  amount: number;
  recipientId: string;
  userId: string;
}

export interface PrepareTransactionResult {
  amount: number;
  recipientId: string;
  userId: string;
}

export interface PrepareTransactionUseCase {
  execute(params: PrepareTransactionParams): Promise<PrepareTransactionResult>;
}
