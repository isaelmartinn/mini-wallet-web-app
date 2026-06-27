"use client";

import {
  Box,
  Card,
  Heading,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { IntlCurrencyFormatter } from "#shared/infrastructure";

interface ReceiptCardProps {
  amount: number;
  date: string;
  description: string;
  recipient: string;
  transferId: string;
}

export function ReceiptCard({
  amount,
  date,
  description,
  recipient,
  transferId,
}: ReceiptCardProps) {
  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);
  const formattedAmount = currencyFormatter.format(amount, "MXN");

  return (
    <Card.Root>
      <Card.Body p={6}>
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading as="h3" color="gray.600" fontWeight="normal">
              Monto
            </Heading>
            <Text fontSize="2xl" fontWeight="bold">
              {formattedAmount}
            </Text>
          </Box>

          <Separator />

          <VStack align="stretch" gap={2}>
            <HStack justify="space-between">
              <Text color="gray.600" fontSize="sm">
                ID de transferencia
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {transferId}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text color="gray.600" fontSize="sm">
                Destinatario
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {recipient}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text color="gray.600" fontSize="sm">
                Fecha
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {date}
              </Text>
            </HStack>

            {description && (
              <HStack justify="space-between">
                <Text color="gray.600" fontSize="sm">
                  Descripción
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {description}
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
