import { Box, Card, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { AlertCircle } from "lucide-react";

import { Transaction } from "#transactions/domain";
import { MovementItem } from "#transactions/infrastructure/ui/components/molecules/movement-item/movement-item";

interface MovementsListProps {
  error?: null | string;
  isLoading: boolean;
  transactions: Transaction[];
}

export function MovementsList({
  error,
  isLoading,
  transactions,
}: MovementsListProps) {
  if (isLoading) {
    return (
      <Card.Root width="full">
        <Card.Body>
          <VStack gap={4} py={8}>
            <Spinner color="brand.500" size="lg" />
            <Text color="gray.600">Cargando movimientos...</Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (error) {
    return (
      <Card.Root width="full">
        <Card.Body>
          <VStack gap={3} py={8}>
            <Box color="red.500">
              <AlertCircle size={48} />
            </Box>
            <Text color="gray.900" fontWeight="semibold">
              Error al cargar movimientos
            </Text>
            <Text color="gray.600" textAlign="center">
              {error}
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card.Root width="full">
        <Card.Body>
          <VStack gap={3} py={8}>
            <Text color="gray.900" fontSize="lg" fontWeight="semibold">
              No hay movimientos
            </Text>
            <Text color="gray.600" textAlign="center">
              Aún no tienes transacciones registradas
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root width="full">
      <Card.Header pb={4} pt={6} px={6}>
        <Heading fontSize="2xl" fontWeight="bold">
          Movimientos recientes
        </Heading>
      </Card.Header>
      <Card.Body p={0}>
        <VStack align="stretch" gap={0} width="full">
          {transactions.map((transaction) => (
            <MovementItem key={transaction.getId()} transaction={transaction} />
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
