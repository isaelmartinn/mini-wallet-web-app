import { Email, Phone, User } from "#auth/domain";

export const mockUsers = [
  User.create({
    email: Email.create("juan@example.com"),
    id: "user-1",
    name: "Juan Pérez",
    phone: Phone.create("+521234567890"),
  }),
  User.create({
    email: Email.create("maria@example.com"),
    id: "user-2",
    name: "María García",
    phone: Phone.create("+529876543210"),
  }),
  User.create({
    email: Email.create("test@test.com"),
    id: "user-3",
    name: "Test User",
    phone: Phone.create("+525555555555"),
  }),
];
