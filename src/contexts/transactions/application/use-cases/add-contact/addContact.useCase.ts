import { randomUUID } from "crypto";

import { Email, Phone } from "#shared/domain/value-objects";
import { Contact } from "#transactions/domain/entities";
import { ContactNameEmptyError } from "#transactions/domain/errors";
import { ContactRepository } from "#transactions/domain/repositories/contact.repository.interface";

import {
  AddContactParams,
  AddContactUseCase as AddContactUseCaseInterface,
} from "./addContact.interface";

export class AddContactUseCase implements AddContactUseCaseInterface {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(params: AddContactParams): Promise<Contact> {
    if (!params.name || params.name.trim() === "") {
      throw new ContactNameEmptyError();
    }

    const email = Email.create(params.email);
    const phone = Phone.create(params.phone);

    const contact = Contact.create({
      email,
      id: randomUUID(),
      isFavorite: params.isFavorite,
      name: params.name,
      phone,
    });

    await this.contactRepository.add(contact);

    return contact;
  }
}
