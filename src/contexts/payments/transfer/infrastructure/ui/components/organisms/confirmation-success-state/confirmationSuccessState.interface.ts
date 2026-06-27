export interface ConfirmationSuccessStateProps {
  amount: number;
  date: string;
  description: string;
  onGoHome: () => void;
  recipientName: string;
  transferId: string;
}
