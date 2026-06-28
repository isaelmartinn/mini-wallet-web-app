import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";
import {
  findMockContactsByUserId,
  MOCK_CONTACTS_DATA,
  MOCK_USERS_DATA,
} from "#shared/infrastructure/mocks";

export function createMockContacts(userId: string): Contact[] {
  const mockContacts = findMockContactsByUserId(userId);
  return mockContacts.map((data) =>
    Contact.create({
      email: Email.create(data.email),
      id: data.id,
      isFavorite: data.isFavorite,
      name: data.name,
      phone: Phone.create(data.phone),
    })
  );
}

export const MOCK_CONTACTS: Contact[] = MOCK_CONTACTS_DATA.map((data) =>
  Contact.create({
    email: Email.create(data.email),
    id: data.id,
    isFavorite: data.isFavorite,
    name: data.name,
    phone: Phone.create(data.phone),
  })
);

export const ALL_CONTACTS_BY_USER: Contact[] = MOCK_USERS_DATA.flatMap((user) =>
  createMockContacts(user.id)
);
