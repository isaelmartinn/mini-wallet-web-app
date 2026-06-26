import { Box, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";

import { Contact } from "#transactions/domain/entities";

import { ContactItem } from "../contact-item";

interface ContactSelectorProps {
  contacts: Contact[];
  disabled?: boolean;
  isLoading: boolean;
  onSelect: (contact: Contact) => void;
  selectedContact: Contact | null;
}

export function ContactSelector({
  contacts,
  disabled = false,
  isLoading,
  onSelect,
  selectedContact,
}: ContactSelectorProps) {
  if (isLoading) {
    return (
      <VStack align="stretch" gap={2}>
        {[1, 2, 3].map((i) => (
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            key={i}
            p={4}
          >
            <HStack gap={3}>
              <Skeleton borderRadius="full" height="40px" width="40px" />
              <VStack align="flex-start" flex={1} gap={1.5}>
                <Skeleton height="16px" width="120px" />
                <Skeleton height="14px" width="200px" />
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  }

  if (contacts.length === 0) {
    return (
      <Box bg="gray.50" borderRadius="md" p={4} textAlign="center">
        <Text color="gray.600">No hay contactos disponibles</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={2}>
      {contacts.map((contact) => (
        <ContactItem
          contact={contact}
          disabled={disabled}
          isSelected={selectedContact?.getId() === contact.getId()}
          key={contact.getId()}
          onSelect={onSelect}
        />
      ))}
    </VStack>
  );
}
