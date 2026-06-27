import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  NumberInput,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Contact } from "#payments/contact/domain/entities";
import { ContactSelector } from "#payments/contact/infrastructure/ui/components";
import { IntlCurrencyFormatter } from "#shared/infrastructure";

import {
  NewTransferFormData,
  TransferFormStepProps,
} from "./transferFormStep.interface";

const newTransferSchema = z.object({
  amount: z.string().min(1, "El monto es requerido"),
  recipientId: z.string().min(1, "Debes seleccionar un destinatario"),
});

export function TransferFormStep({
  balance,
  contacts,
  isLoadingBalance,
  isLoadingContacts,
  isSubmitting,
  onContactSelect,
  onSubmit,
  preselectedContact,
}: TransferFormStepProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    preselectedContact || null
  );

  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);

  const form = useForm<NewTransferFormData>({
    defaultValues: {
      amount: "",
      recipientId: preselectedContact?.getId() || "",
    },
    mode: "onChange",
    resolver: zodResolver(newTransferSchema),
  });

  const amountValue = useWatch({
    control: form.control,
    name: "amount",
  });

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    form.setValue("recipientId", contact.getId());
    form.clearErrors("recipientId");
    onContactSelect?.(contact);
  };

  return (
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
                      <Text as="span" color="gray.900" fontWeight="bold">
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
                    isNaN(details.valueAsNumber)
                      ? ""
                      : details.valueAsNumber.toString()
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
              <Heading as="h3" mb={2}>
                Destinatario
              </Heading>
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
  );
}
