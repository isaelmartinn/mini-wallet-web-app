"use client";

import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { User } from "lucide-react";

import { Contact } from "#payments/contact/domain/entities";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";

interface ContactItemProps {
  contact: Contact;
  disabled?: boolean;
  isSelected: boolean;
  onSelect: (contact: Contact) => void;
  readonly?: boolean;
}

export function ContactItem({
  contact,
  disabled = false,
  isSelected,
  onSelect,
  readonly = false,
}: ContactItemProps) {
  const iconColor = useThemeToken("colors", "icon.primary");

  const content = (
    <HStack gap={3} width="full">
      <Box
        alignItems="center"
        bg={isSelected ? "blue.500" : "gray.100"}
        borderRadius="full"
        color={isSelected ? "white" : "gray.600"}
        display="flex"
        flexShrink={0}
        height="40px"
        justifyContent="center"
        width="40px"
      >
        <User color={isSelected ? "white" : iconColor} size={20} />
      </Box>
      <VStack align="flex-start" flex={1} gap={1.5}>
        <Text fontSize="md" fontWeight="medium">
          {contact.getName()}
        </Text>
        <HStack gap={2}>
          {contact.getEmail() && (
            <Badge
              colorPalette="gray"
              fontSize="xs"
              px={2}
              py={0.5}
              variant="subtle"
            >
              {contact.getEmail().getValue()}
            </Badge>
          )}
          {contact.getPhone() && (
            <Badge
              colorPalette="gray"
              fontSize="xs"
              px={2}
              py={0.5}
              variant="subtle"
            >
              {contact.getPhone().getValue()}
            </Badge>
          )}
        </HStack>
      </VStack>
    </HStack>
  );

  if (readonly) {
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        px={4}
        py={3}
        width="full"
      >
        {content}
      </Box>
    );
  }

  return (
    <Button
      bg={isSelected ? "blue.50" : "white"}
      border="1px solid"
      borderColor={isSelected ? "blue.500" : "gray.200"}
      disabled={disabled}
      height="auto"
      justifyContent="flex-start"
      onClick={() => onSelect(contact)}
      px={4}
      py={3}
      variant="outline"
      width="full"
    >
      {content}
    </Button>
  );
}
