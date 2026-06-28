import { Transfer } from "#payments/transfer/domain";
import { MovementsEmptyState } from "#payments/transfer/infrastructure/ui/components/molecules/movements-empty-state";
import { MovementsErrorState } from "#payments/transfer/infrastructure/ui/components/molecules/movements-error-state";
import { MovementsList } from "#payments/transfer/infrastructure/ui/components/molecules/movements-list";
import { MovementsLoadingState } from "#payments/transfer/infrastructure/ui/components/molecules/movements-loading-state";

interface MovementsHistoryProps {
  error?: null | string;
  isLoading: boolean;
  onRetryLoadTransactions?: () => void;
  transactions: Transfer[];
}

export function MovementsHistory({
  error,
  isLoading,
  onRetryLoadTransactions,
  transactions,
}: MovementsHistoryProps) {
  if (isLoading) {
    return <MovementsLoadingState count={5} />;
  }

  if (error) {
    return (
      <MovementsErrorState
        errorMessage={error}
        onRetry={onRetryLoadTransactions}
      />
    );
  }

  if (transactions.length === 0) {
    return <MovementsEmptyState />;
  }

  return <MovementsList transactions={transactions} />;
}
