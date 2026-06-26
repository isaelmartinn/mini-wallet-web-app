import { Email, Phone } from "#shared/domain/value-objects";

export interface Contact {
  getEmail(): Email;
  getId(): string;
  getName(): string;
  getPhone(): Phone;
  isFavorite(): boolean;
}

export interface CreateContactParams {
  email: Email;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: Phone;
}
