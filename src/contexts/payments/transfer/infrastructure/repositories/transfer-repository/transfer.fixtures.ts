import {
  Transfer,
  TransferAmount,
  TransferStatus,
  TransferType,
} from "#payments/transfer/domain";
import {
  findMockTransactionsByUserId,
  MOCK_USERS_DATA,
} from "#shared/infrastructure/mocks";

export function createMockTransfers(userId: string): Transfer[] {
  const mockTransactions = findMockTransactionsByUserId(userId);
  return mockTransactions.map(createTransferFromMockData);
}

export const TRANSACTION_FIXTURES: Transfer[] = MOCK_USERS_DATA.flatMap(
  (user) => createMockTransfers(user.id)
);

function createTransferFromMockData(
  mockTransaction: ReturnType<typeof findMockTransactionsByUserId>[0]
): Transfer {
  const statusMap = {
    failed: TransferStatus.failed(),
    pending: TransferStatus.pending(),
    success: TransferStatus.success(),
  };

  const typeMap = {
    expense: TransferType.expense(),
    income: TransferType.income(),
  };

  return Transfer.create({
    amount: TransferAmount.create(mockTransaction.amount),
    date: new Date(mockTransaction.date),
    description: mockTransaction.description,
    id: mockTransaction.id,
    recipientId: mockTransaction.recipientId,
    status: statusMap[mockTransaction.status],
    type: typeMap[mockTransaction.type],
    userId: mockTransaction.userId,
  });
}
