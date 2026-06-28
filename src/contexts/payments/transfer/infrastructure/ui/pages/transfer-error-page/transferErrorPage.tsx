"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Home, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ERROR_STATES_CONFIG,
  TransferErrorType,
} from "#payments/transfer/infrastructure/ui/config/errorStates.config";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";

export function TransferErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorType =
    (searchParams.get("type") as TransferErrorType) ?? "UNKNOWN_ERROR";

  const config =
    ERROR_STATES_CONFIG[errorType] ?? ERROR_STATES_CONFIG.UNKNOWN_ERROR;
  const iconColor = useThemeToken("colors", config.iconColor);

  const handleRetry = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/home");
  };

  const Icon = config.icon;

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <Box
            alignItems="center"
            bg={config.iconBgColor}
            borderRadius="full"
            data-testid="error-icon"
            display="flex"
            h={20}
            justifyContent="center"
            mx="auto"
            w={20}
          >
            <Icon color={iconColor} size={48} />
          </Box>

          <VStack gap={2}>
            <Heading data-testid="error-title" size="lg">
              {config.title}
            </Heading>
            <Text
              color="gray.600"
              data-testid="error-description"
              textAlign="center"
            >
              {config.description}
            </Text>
          </VStack>

          <VStack gap={3} w="full">
            {config.showRetryButton && (
              <Button
                colorScheme="blue"
                data-testid="retry-button"
                onClick={handleRetry}
                size="lg"
                variant="solid"
                width="full"
              >
                <RefreshCw size={20} />
                Reintentar
              </Button>
            )}
            <Button
              colorScheme={config.showRetryButton ? undefined : "blue"}
              data-testid="go-home-button"
              onClick={handleGoHome}
              size="lg"
              variant={config.showRetryButton ? "outline" : "solid"}
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
