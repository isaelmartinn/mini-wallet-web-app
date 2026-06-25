import { Email, Phone, User } from "#auth/domain";
import { MOCK_USERS_DATA } from "#shared/infrastructure/mocks";

export const mockUsers = MOCK_USERS_DATA.map((data) =>
  User.create({
    email: Email.create(data.email),
    id: data.id,
    name: data.name,
    phone: Phone.create(data.phone),
  })
);
