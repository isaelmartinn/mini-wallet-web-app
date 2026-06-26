"use client";

import { Avatar, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";

interface UserHeaderCompactProps {
  fullName?: string;
  initials?: string;
  isLoading?: boolean;
}

export function UserHeaderCompact({
  fullName,
  initials,
  isLoading = false,
}: UserHeaderCompactProps) {
  if (isLoading || !fullName) {
    return (
      <HStack gap={3}>
        <Skeleton borderRadius="full" height="40px" width="40px" />
        <VStack align="start" gap={1}>
          <Skeleton height="14px" width="100px" />
          <Skeleton height="18px" width="140px" />
        </VStack>
      </HStack>
    );
  }

  const greeting = getGreeting();

  return (
    <HStack gap={3}>
      <Avatar.Root size="md">
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar.Root>
      <VStack align="start" gap={0}>
        <Text color="gray.600" fontSize="xs" fontWeight="medium">
          {greeting}
        </Text>
        <Text color="gray.900" fontSize="md" fontWeight="bold">
          {fullName}
        </Text>
      </VStack>
    </HStack>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Buenos días";
  }

  if (hour < 19) {
    return "Buenas tardes";
  }

  return "Buenas noches";
}
