"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  NumberInput,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AuthStore, UserWithId } from "#shared/domain/interfaces";
import { BalanceProvider } from "#shared/domain/interfaces/balanceProvider.interface";
import { IntlCurrencyFormatter } from "#shared/infrastructure";
import { useAuthContext } from "#shared/infrastructure/hooks";
import { useFormErrorHandler } from "#shared/infrastructure/ui/hooks";
import {
  GetContactsUseCase,
  PrepareTransactionResult,
  PrepareTransactionUseCase,
} from "#transactions/application/use-cases";
import { Contact } from "#transactions/domain/entities";
import { TransactionValidationService } from "#transactions/domain/services";
import { ContactRepositoryMock } from "#transactions/infrastructure/repositories";

import { ContactItem, ContactSelector } from "../../components";
import { TransactionFormErrorMapper } from "../../error-mapper/transactionFormErrorMapper";

const newTransactionSchema = z.object({
  amount: z.string().min(1, "El monto es requerido"),
  recipientId: z.string().min(1, "Debes seleccionar un destinatario"),
});

type NewTransactionFormData = z.infer<typeof newTransactionSchema>;

interface NewTransactionPageProps<TUser extends UserWithId> {
  authStore: AuthStore<TUser>;
  balanceProvider: BalanceProvider;
}

export function NewTransactionPage<TUser extends UserWithId>({
  authStore,
  balanceProvider,
}: NewTransactionPageProps<TUser>) {
  const router = useRouter();
  const { user } = useAuthContext(authStore);

  const [step, setStep] = useState<"form" | "summary">("form");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [transactionDraft, setTransactionDraft] =
    useState<null | PrepareTransactionResult>(null);
  const [balance, setBalance] = useState<null | number>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewTransactionFormData>({
    defaultValues: {
      amount: "",
      recipientId: "",
    },
    mode: "onChange",
    resolver: zodResolver(newTransactionSchema),
  });

  const errorMappers = useMemo(() => [new TransactionFormErrorMapper()], []);
  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);
  const { handleError } = useFormErrorHandler({
    form,
    formErrorMappers: errorMappers,
    presentationMappers: errorMappers,
  });

  const amountValue = useWatch({
    control: form.control,
    name: "amount",
  });

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
        const contactRepository = new ContactRepositoryMock();
        const getContactsUseCase = new GetContactsUseCase(contactRepository);
        const contactsList = await getContactsUseCase.execute();
        setContacts(contactsList);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    loadContacts();
  }, [handleError]);

  const onSubmit = async (data: NewTransactionFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const validationService = new TransactionValidationService(
        balanceProvider
      );
      const prepareTransactionUseCase = new PrepareTransactionUseCase(
        validationService
      );

      const draft = await prepareTransactionUseCase.execute({
        amount: parseFloat(data.amount),
        recipientId: data.recipientId,
        userId: user.getId(),
      });

      setTransactionDraft(draft);
      setStep("summary");
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    form.setValue("recipientId", contact.getId());
    form.clearErrors("recipientId");
  };

  const handleBack = () => {
    if (step === "summary") {
      setStep("form");
    } else {
      router.push("/home");
    }
  };

  const handleConfirm = () => {
    router.push("/home");
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
            <Card.Root>
              <Card.Body p={6}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <VStack align="stretch" gap={6}>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          Monto
                        </Text>
                        {isLoadingBalance ? (
                          <Skeleton height="16px" width="120px" />
                        ) : (
                          balance !== null && (
                            <Text color="gray.600" fontSize="sm">
                              Saldo disponible:{" "}
                              <Text
                                as="span"
                                color="gray.900"
                                fontWeight="bold"
                              >
                                {currencyFormatter.format(balance, "MXN")}
                              </Text>
                            </Text>
                          )
                        )}
                      </HStack>
                      <NumberInput.Root
                        disabled={isSubmitting}
                        formatOptions={{
                          currency: "MXN",
                          currencyDisplay: "symbol",
                          style: "currency",
                        }}
                        min={0}
                        onValueChange={(details) => {
                          form.setValue(
                            "amount",
                            details.valueAsNumber.toString()
                          );
                          form.clearErrors("amount");
                        }}
                        size="lg"
                        step={0.01}
                        value={amountValue}
                      >
                        <NumberInput.Input placeholder="$0.00" px={4} />
                      </NumberInput.Root>
                      {form.formState.errors.amount && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {form.formState.errors.amount.message}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Destinatario
                      </Text>
                      <ContactSelector
                        contacts={contacts}
                        disabled={isSubmitting}
                        isLoading={isLoadingContacts}
                        onSelect={handleContactSelect}
                        selectedContact={selectedContact}
                      />
                      {form.formState.errors.recipientId && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {form.formState.errors.recipientId.message}
                        </Text>
                      )}
                    </Box>

                    <Button
                      colorScheme="blue"
                      loading={isSubmitting}
                      size="lg"
                      type="submit"
                      width="full"
                    >
                      Continuar
                    </Button>
                  </VStack>
                </form>
              </Card.Body>
            </Card.Root>
          )}

          {step === "summary" &&
            transactionDraft &&
            selectedContact &&
            balance !== null && (
              <Card.Root>
                <Card.Body p={6}>
                  <VStack align="stretch" gap={6}>
                    <VStack align="center" gap={2}>
                      <Text
                        color="blue.600"
                        fontSize="sm"
                        fontWeight="bold"
                        letterSpacing="wide"
                        textTransform="uppercase"
                      >
                        Resumen del envío
                      </Text>
                      <Heading color="gray.900" size="3xl">
                        {currencyFormatter.format(
                          transactionDraft.amount,
                          "MXN"
                        )}
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        Saldo actual tras envío:{" "}
                        {currencyFormatter.format(
                          balance - transactionDraft.amount,
                          "MXN"
                        )}
                      </Text>
                    </VStack>

                    <ContactItem
                      contact={selectedContact}
                      isSelected={false}
                      onSelect={() => {}}
                      readonly
                    />

                    <VStack align="stretch" gap={3}>
                      <HStack justify="space-between">
                        <Text color="gray.700">Comisión</Text>
                        <Text color="green.600" fontWeight="bold">
                          Gratis
                        </Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text color="gray.700">Método de pago</Text>
                        <Text color="gray.900" fontWeight="medium">
                          Mini Wallet Balance
                        </Text>
                      </HStack>
                    </VStack>

                    <HStack
                      borderColor="gray.200"
                      borderTop="1px solid"
                      justify="space-between"
                      pt={4}
                    >
                      <Text color="gray.900" fontSize="lg" fontWeight="bold">
                        Total a transferir
                      </Text>
                      <Text color="gray.900" fontSize="2xl" fontWeight="bold">
                        {currencyFormatter.format(
                          transactionDraft.amount,
                          "MXN"
                        )}
                      </Text>
                    </HStack>

                    <Button
                      colorScheme="blue"
                      onClick={handleConfirm}
                      size="lg"
                      width="full"
                    >
                      <Send size={20} />
                      Confirmar Transferencia
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )}
        </VStack>
      </Container>
    </Box>
  );
}
