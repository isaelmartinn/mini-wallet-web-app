import { Box, Card, Heading, VStack } from "@chakra-ui/react";

import { Transfer } from "#payments/transfer/domain";
import { MovementItem } from "#payments/transfer/infrastructure/ui/components/molecules/movement-item";

interface MovementsListProps {
  transactions: Transfer[];
}

export function MovementsList({ transactions }: MovementsListProps) {
  return (
    <Card.Root data-testid="movements-list" width="full">
      <Card.Header pb={4} pt={6} px={6}>
        <Heading fontSize="2xl" fontWeight="bold">
          Movimientos recientes
        </Heading>
      </Card.Header>
      <Card.Body p={0}>
        <Box maxH="400px" overflowY="auto">
          <VStack align="stretch" gap={0} width="full">
            {transactions.map((transaction) => (
              <MovementItem
                key={transaction.getId()}
                transaction={transaction}
              />
            ))}
          </VStack>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}
