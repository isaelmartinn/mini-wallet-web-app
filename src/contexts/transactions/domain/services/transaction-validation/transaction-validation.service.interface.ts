export interface TransactionValidationService {
  validateTransaction(params: ValidateTransactionParams): Promise<void>;
}

export interface ValidateTransactionParams {
  amount: number;
  recipientId: string;
  userId: string;
}
