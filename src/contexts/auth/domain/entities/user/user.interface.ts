import { Email, Phone } from "#shared/domain/value-objects";

export interface User {
  getEmail(): Email | null;
  getId(): string;
  getName(): string;
  getPhone(): null | Phone;
}
