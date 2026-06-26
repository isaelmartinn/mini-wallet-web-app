import { Email, Phone } from "#shared/domain/value-objects";
import { MOCK_CONTACTS_DATA } from "#shared/infrastructure/mocks";
import { Contact } from "#transactions/domain/entities";

export const MOCK_CONTACTS: Contact[] = MOCK_CONTACTS_DATA.map((data) =>
  Contact.create({
    email: Email.create(data.email),
    id: data.id,
    isFavorite: data.isFavorite,
    name: data.name,
    phone: Phone.create(data.phone),
  })
);
