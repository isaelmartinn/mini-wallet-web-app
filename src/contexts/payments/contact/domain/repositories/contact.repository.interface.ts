import { Contact } from "#payments/contact/domain/entities";
import { Email, Phone } from "#shared/domain/value-objects";

export interface ContactRepository {
  add(contact: Contact): Promise<void>;
  findAll(): Promise<Contact[]>;
  findByEmail(email: Email): Promise<Contact | null>;
  findById(id: string): Promise<Contact | null>;
  findByName(name: string): Promise<Contact | null>;
  findByPhone(phone: Phone): Promise<Contact | null>;
  findFavorites(): Promise<Contact[]>;
}
