import { Contact } from "#payments/contact/domain/entities";

export interface NewTransferFormData {
  amount: string;
  recipientId: string;
}

export interface TransferFormStepProps {
  balance: null | number;
  contacts: Contact[];
  isLoadingBalance: boolean;
  isLoadingContacts: boolean;
  isSubmitting: boolean;
  onContactSelect?: (contact: Contact) => void;
  onSubmit: (data: NewTransferFormData) => void;
  preselectedContact?: Contact | null;
}
