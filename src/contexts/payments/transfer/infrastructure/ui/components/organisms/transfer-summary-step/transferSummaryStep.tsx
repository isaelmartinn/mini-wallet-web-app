import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Send } from "lucide-react";
import { useMemo } from "react";

import { ContactItem } from "#payments/contact/infrastructure/ui/components";
import { IntlCurrencyFormatter } from "#shared/infrastructure";

import { TransferSummaryStepProps } from "./transferSummaryStep.interface";

export function TransferSummaryStep({
  balance,
  contact,
  onConfirm,
  transferDraft,
}: TransferSummaryStepProps) {
  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);

  const resultingBalance = balance - transferDraft.amount;

  return (
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
            <Heading color="gray.900" data-testid="summary-amount" size="3xl">
              {currencyFormatter.format(transferDraft.amount, "MXN")}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Saldo actual tras envío:{" "}
              {currencyFormatter.format(resultingBalance, "MXN")}
            </Text>
          </VStack>

          <Box data-testid="summary-recipient">
            <ContactItem
              contact={contact}
              isSelected={false}
              onSelect={() => {}}
              readonly
            />
          </Box>

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
              {currencyFormatter.format(transferDraft.amount, "MXN")}
            </Text>
          </HStack>

          <Button
            colorScheme="blue"
            data-testid="confirm-button"
            onClick={onConfirm}
            size="lg"
            width="full"
          >
            <Send size={20} />
            Confirmar Transferencia
          </Button>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
