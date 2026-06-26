import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository } from "#payments/contact/domain/repositories/contact.repository.interface";

import { GetContactsUseCase as GetContactsUseCaseInterface } from "./getContacts.interface";

export class GetContactsUseCase implements GetContactsUseCaseInterface {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<Contact[]> {
    return await this.contactRepository.findAll();
  }
}
