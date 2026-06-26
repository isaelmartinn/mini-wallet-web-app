import { Contact } from "#transactions/domain/entities";

export interface GetContactsUseCase {
  execute(): Promise<Contact[]>;
}
