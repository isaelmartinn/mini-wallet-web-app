"use client";

import { Box, Container, VStack } from "@chakra-ui/react";

import { useAuthStore } from "#auth/session/infrastructure/store";
import { MovementsSection } from "#payments/transfer/infrastructure/ui/pages";
import { BalanceSection } from "#wallet/balance/infrastructure/ui/pages";

export default function HomeRoute() {
  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <BalanceSection authStore={useAuthStore} />
          <MovementsSection authStore={useAuthStore} />
        </VStack>
      </Container>
    </Box>
  );
}
