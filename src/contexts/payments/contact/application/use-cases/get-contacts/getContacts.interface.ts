import { Contact } from "#payments/contact/domain/entities";

export interface GetContactsUseCase {
  execute(): Promise<Contact[]>;
}
