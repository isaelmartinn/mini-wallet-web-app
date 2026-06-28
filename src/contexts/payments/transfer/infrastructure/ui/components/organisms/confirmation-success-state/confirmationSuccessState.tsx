import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react";
import { Check, Home } from "lucide-react";

import { ReceiptCard } from "#payments/transfer/infrastructure/ui/components";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";

import { ConfirmationSuccessStateProps } from "./confirmationSuccessState.interface";

export function ConfirmationSuccessState({
  amount,
  date,
  description,
  onGoHome,
  recipientName,
  transferId,
}: ConfirmationSuccessStateProps) {
  const successColor = useThemeToken("colors", "green.500");

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <Box display="flex" justifyContent="center" width="full">
            <Box
              alignItems="center"
              bg="green.50"
              borderRadius="full"
              data-testid="success-icon"
              display="flex"
              h={20}
              justifyContent="center"
              w={20}
            >
              <Check color={successColor} size={48} />
            </Box>
          </Box>

          <Heading size="lg" textAlign="center">
            Transferencia exitosa
          </Heading>

          <ReceiptCard
            amount={amount}
            date={date}
            description={description}
            recipient={recipientName}
            transferId={transferId}
          />

          <Button
            colorScheme="blue"
            data-testid="back-to-home-button"
            onClick={onGoHome}
            size="lg"
            width="full"
          >
            <Home size={20} />
            Volver al inicio
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
