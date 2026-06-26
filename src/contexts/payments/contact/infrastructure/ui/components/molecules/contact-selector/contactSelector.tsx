import { Box, Button, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Star, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Contact } from "#payments/contact/domain/entities";
import { ContactItem } from "#payments/contact/infrastructure/ui/components/molecules/contact-item";

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
  const router = useRouter();

  const favoriteContacts = contacts.filter((c) => c.isFavorite());
  const regularContacts = contacts.filter((c) => !c.isFavorite());

  const handleAddContact = (): void => {
    router.push("/transactions/contacts/new");
  };

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

  return (
    <VStack align="stretch" gap={4}>
      <Button
        colorScheme="blue"
        disabled={disabled}
        onClick={handleAddContact}
        variant="outline"
        width="full"
      >
        <HStack>
          <UserPlus size={20} />
          <Text>Agregar nuevo contacto</Text>
        </HStack>
      </Button>

      {favoriteContacts.length > 0 && (
        <Box>
          <HStack mb={2}>
            <Star fill="gold" size={16} stroke="gold" />
            <Text color="gray.700" fontSize="sm" fontWeight="bold">
              Favoritos
            </Text>
          </HStack>
          <Box maxH="300px" overflowY="auto">
            <VStack align="stretch" gap={2}>
              {favoriteContacts.map((contact) => (
                <ContactItem
                  contact={contact}
                  disabled={disabled}
                  isSelected={selectedContact?.getId() === contact.getId()}
                  key={contact.getId()}
                  onSelect={onSelect}
                />
              ))}
            </VStack>
          </Box>
        </Box>
      )}

      {regularContacts.length > 0 && (
        <Box>
          <Text color="gray.700" fontSize="sm" fontWeight="bold" mb={2}>
            Todos los contactos
          </Text>
          <Box maxH="300px" overflowY="auto">
            <VStack align="stretch" gap={2}>
              {regularContacts.map((contact) => (
                <ContactItem
                  contact={contact}
                  disabled={disabled}
                  isSelected={selectedContact?.getId() === contact.getId()}
                  key={contact.getId()}
                  onSelect={onSelect}
                />
              ))}
            </VStack>
          </Box>
        </Box>
      )}

      {contacts.length === 0 && (
        <Box bg="gray.50" borderRadius="md" p={4} textAlign="center">
          <Text color="gray.600">No hay contactos disponibles</Text>
        </Box>
      )}
    </VStack>
  );
}
