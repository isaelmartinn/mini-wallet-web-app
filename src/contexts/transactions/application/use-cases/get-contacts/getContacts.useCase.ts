import { Contact } from "#transactions/domain/entities";
import { ContactRepository } from "#transactions/domain/repositories/contact.repository.interface";

import { GetContactsUseCase as GetContactsUseCaseInterface } from "./getContacts.interface";

export class GetContactsUseCase implements GetContactsUseCaseInterface {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<Contact[]> {
    return await this.contactRepository.findAll();
  }
}
