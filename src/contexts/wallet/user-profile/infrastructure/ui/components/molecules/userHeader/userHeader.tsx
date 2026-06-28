"use client";

import { Avatar, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";

import { UserProfile } from "#wallet/user-profile/domain/entities";

interface UserHeaderProps {
  isLoading?: boolean;
  userProfile: null | UserProfile;
}

export function UserHeader({
  isLoading = false,
  userProfile,
}: UserHeaderProps) {
  if (isLoading || !userProfile) {
    return (
      <HStack gap={4}>
        <Skeleton borderRadius="full" height="48px" width="48px" />
        <VStack align="start" gap={1}>
          <Skeleton height="16px" width="120px" />
          <Skeleton height="24px" width="180px" />
        </VStack>
      </HStack>
    );
  }

  const greeting = getGreeting();

  return (
    <HStack gap={4}>
      <Avatar.Root size="lg">
        <Avatar.Fallback>{userProfile.getInitials()}</Avatar.Fallback>
      </Avatar.Root>
      <VStack align="start" gap={0}>
        <Text color="gray.600" fontSize="sm" fontWeight="medium">
          {greeting}
        </Text>
        <Text color="gray.900" fontSize="xl" fontWeight="bold">
          {userProfile.getFullName()}
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
