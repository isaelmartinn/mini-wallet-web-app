import { Email, Phone } from "#auth/domain/value-objects";

export interface User {
  getEmail(): Email | null;
  getId(): string;
  getName(): string;
  getPhone(): null | Phone;
}
