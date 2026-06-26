import { Contact } from "#payments/contact/domain/entities";
import { PrepareTransferResult } from "#payments/transfer/application/use-cases";

export interface TransferSummaryStepProps {
  balance: number;
  contact: Contact;
  onConfirm: () => void;
  transferDraft: PrepareTransferResult;
}
