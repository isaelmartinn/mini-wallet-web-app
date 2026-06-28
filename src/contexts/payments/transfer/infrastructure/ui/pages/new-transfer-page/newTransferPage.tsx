"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GetContactsUseCase } from "#payments/contact/application/use-cases";
import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import {
  PrepareTransferResult,
  PrepareTransferUseCase,
} from "#payments/transfer/application/use-cases";
import { TransferRepositoryImpl } from "#payments/transfer/infrastructure/repositories";
import {
  TransferFormStep,
  TransferSummaryStep,
} from "#payments/transfer/infrastructure/ui/components";
import { NewTransferFormData } from "#payments/transfer/infrastructure/ui/components/organisms/transfer-form-step";
import { TransferFormErrorMapper } from "#payments/transfer/infrastructure/ui/error-mapper/transferFormErrorMapper";
import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { WalletRepository } from "#wallet/infrastructure/repositories";

interface NewTransferPageProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
  balanceProvider: BalanceProvider;
}

export function NewTransferPage<TUser extends UserWithId>({
  authStore,
  balanceProvider,
}: NewTransferPageProps<TUser>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext(authStore);

  const [step, setStep] = useState<"form" | "summary">("form");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [transferDraft, setTransferDraft] =
    useState<null | PrepareTransferResult>(null);
  const [balance, setBalance] = useState<null | number>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorMappers = useMemo(() => [new TransferFormErrorMapper()], []);
  const { handleError } = useErrorHandler(errorMappers);

  useEffect(() => {
    const loadBalance = async () => {
      if (!user) return;

      setIsLoadingBalance(true);
      try {
        const availableBalance = await balanceProvider.getAvailableBalance(
          user.getId()
        );
        setBalance(availableBalance);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();
  }, [user, balanceProvider, handleError]);

  useEffect(() => {
    const loadContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const contactRepository = new ContactRepository();
        const getContactsUseCase = new GetContactsUseCase(contactRepository);
        const contactsList = await getContactsUseCase.execute();
        setContacts(contactsList);

        const contactId = searchParams.get("contactId");
        if (contactId) {
          const preselectedContact = contactsList.find(
            (c) => c.getId() === contactId
          );
          if (preselectedContact) {
            setSelectedContact(preselectedContact);
          }

          const params = new URLSearchParams(searchParams.toString());
          params.delete("contactId");
          router.replace(`/transactions/new?${params.toString()}`);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    loadContacts();
  }, [handleError, searchParams, router]);

  const onSubmit = async (data: NewTransferFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const transferRepository = new TransferRepositoryImpl();
      const walletRepository = WalletRepository.getInstance();
      const contactRepository = new ContactRepository();
      const prepareTransferUseCase = new PrepareTransferUseCase(
        transferRepository,
        walletRepository,
        contactRepository
      );

      const draft = await prepareTransferUseCase.execute({
        amount: parseFloat(data.amount),
        recipientId: data.recipientId,
        userId: user.getId(),
      });

      setTransferDraft(draft);
      setStep("summary");
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBack = () => {
    if (step === "summary") {
      setStep("form");
    } else {
      router.push("/home");
    }
  };

  const handleConfirm = () => {
    if (!transferDraft || !selectedContact) return;

    const params = new URLSearchParams({
      transferId: transferDraft.transferId,
    });

    router.push(`/transactions/confirm?${params.toString()}`);
  };

  if (!user) {
    return null;
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <HStack>
            <Button
              colorScheme="gray"
              data-testid="back-button"
              onClick={handleBack}
              size="sm"
              variant="ghost"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading size="lg">
              {step === "form"
                ? "Nueva Transferencia"
                : "Confirmar Transferencia"}
            </Heading>
          </HStack>

          {step === "form" && (
            <TransferFormStep
              balance={balance}
              contacts={contacts}
              isLoadingBalance={isLoadingBalance}
              isLoadingContacts={isLoadingContacts}
              isSubmitting={isSubmitting}
              onContactSelect={handleContactSelect}
              onSubmit={onSubmit}
              preselectedContact={selectedContact}
            />
          )}

          {step === "summary" &&
            transferDraft &&
            selectedContact &&
            balance !== null && (
              <TransferSummaryStep
                balance={balance}
                contact={selectedContact}
                onConfirm={handleConfirm}
                transferDraft={transferDraft}
              />
            )}
        </VStack>
      </Container>
    </Box>
  );
}
