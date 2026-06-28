import { Box, Card, HStack, Skeleton, VStack } from "@chakra-ui/react";

interface MovementsLoadingStateProps {
  count?: number;
}

export function MovementsLoadingState({
  count = 3,
}: MovementsLoadingStateProps) {
  return (
    <Card.Root data-testid="loading-state" width="full">
      <Card.Header pb={4} pt={6} px={6}>
        <Skeleton height="32px" width="200px" />
      </Card.Header>
      <Card.Body p={0}>
        <VStack align="stretch" gap={0}>
          {Array.from({ length: count }).map((_, index) => (
            <Box
              borderBottom="1px solid"
              borderColor="gray.200"
              key={index}
              p={4}
            >
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Skeleton borderRadius="full" height="40px" width="40px" />
                  <VStack align="start" gap={2}>
                    <Skeleton height="16px" width="150px" />
                    <Skeleton height="14px" width="100px" />
                  </VStack>
                </HStack>
                <VStack align="end" gap={2}>
                  <Skeleton height="18px" width="80px" />
                  <Skeleton height="14px" width="60px" />
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
