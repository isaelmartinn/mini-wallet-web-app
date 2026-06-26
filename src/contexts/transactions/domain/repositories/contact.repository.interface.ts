import { Contact } from "../entities";

export interface ContactRepository {
  add(contact: Contact): Promise<void>;
  findAll(): Promise<Contact[]>;
  findById(id: string): Promise<Contact | null>;
  findFavorites(): Promise<Contact[]>;
}
