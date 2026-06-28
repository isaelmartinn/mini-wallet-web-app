import { Card, Text, VStack } from "@chakra-ui/react";

export function MovementsEmptyState() {
  return (
    <Card.Root data-testid="empty-state" width="full">
      <Card.Body>
        <VStack gap={3} py={8}>
          <Text
            color="gray.900"
            data-testid="empty-title"
            fontSize="lg"
            fontWeight="semibold"
          >
            No hay movimientos
          </Text>
          <Text
            color="gray.600"
            data-testid="empty-description"
            textAlign="center"
          >
            Aún no tienes transacciones registradas
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
