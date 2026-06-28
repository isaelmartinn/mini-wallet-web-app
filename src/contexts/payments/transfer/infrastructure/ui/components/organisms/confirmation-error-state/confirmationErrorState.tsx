import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { useThemeToken } from "#shared/infrastructure/ui/hooks";

import { ConfirmationErrorStateProps } from "./confirmationErrorState.interface";

export function ConfirmationErrorState({
  onGoHome,
  onRetry,
}: ConfirmationErrorStateProps) {
  const errorColor = useThemeToken("colors", "red.500");

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <Box
            alignItems="center"
            bg="red.50"
            borderRadius="full"
            data-testid="error-icon"
            display="flex"
            h={20}
            justifyContent="center"
            mx="auto"
            w={20}
          >
            <AlertCircle color={errorColor} size={48} />
          </Box>

          <VStack gap={2}>
            <Heading data-testid="error-message" size="lg">
              Error en la transferencia
            </Heading>
            <Text color="gray.600" textAlign="center">
              Ocurrió un error al procesar tu transferencia. Por favor, intenta
              nuevamente.
            </Text>
          </VStack>

          <VStack gap={3} w="full">
            <Button
              colorScheme="blue"
              data-testid="retry-button"
              onClick={onRetry}
              size="lg"
              width="full"
            >
              <RefreshCw size={20} />
              Reintentar
            </Button>
            <Button
              data-testid="cancel-button"
              onClick={onGoHome}
              size="lg"
              variant="outline"
              width="full"
            >
              <Home size={20} />
              Volver al inicio
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
