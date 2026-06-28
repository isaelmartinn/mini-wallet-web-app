import { Box, Button, Card, Text, VStack } from "@chakra-ui/react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useThemeToken } from "#shared/infrastructure/ui/hooks";

interface MovementsErrorStateProps {
  errorMessage: string;
  onRetry?: () => void;
}

export function MovementsErrorState({
  errorMessage,
  onRetry,
}: MovementsErrorStateProps) {
  const iconColor = useThemeToken("colors", "red.500");

  return (
    <Card.Root data-testid="error-state" width="full">
      <Card.Body>
        <VStack gap={4} py={8}>
          <Box color="red.500">
            <AlertCircle color={iconColor} size={48} />
          </Box>
          <Text
            color="gray.900"
            data-testid="error-title"
            fontWeight="semibold"
          >
            Error al cargar movimientos
          </Text>
          <Text color="gray.600" data-testid="error-message" textAlign="center">
            {errorMessage}
          </Text>
          {onRetry && (
            <Button
              colorPalette="brand"
              data-testid="retry-button"
              onClick={onRetry}
              px={6}
              py={3}
              size="md"
              variant="outline"
            >
              <RefreshCw size={16} />
              Reintentar
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
