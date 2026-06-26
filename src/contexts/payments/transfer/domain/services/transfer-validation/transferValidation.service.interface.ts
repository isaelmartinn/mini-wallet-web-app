export interface TransferValidationService {
  validateTransfer(params: ValidateTransferParams): Promise<void>;
}

export interface ValidateTransferParams {
  amount: number;
  recipientId: string;
  userId: string;
}
