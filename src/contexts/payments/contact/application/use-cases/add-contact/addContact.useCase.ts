import { Contact } from "#payments/contact/domain/entities";
import {
  ContactNameEmptyError,
  DuplicateContactEmailError,
  DuplicateContactNameError,
  DuplicateContactPhoneError,
} from "#payments/contact/domain/errors";
import { ContactRepository } from "#payments/contact/domain/repositories/contact.repository.interface";
import { Email, Phone } from "#shared/domain/value-objects";
import { generateId } from "#shared/infrastructure/utils/generate-id/generateId";

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

    const existingByName = await this.contactRepository.findByName(params.name);
    if (existingByName) {
      throw new DuplicateContactNameError();
    }

    const email = Email.create(params.email);
    const phone = Phone.create(params.phone);

    const existingByEmail = await this.contactRepository.findByEmail(email);
    if (existingByEmail) {
      throw new DuplicateContactEmailError();
    }

    const existingByPhone = await this.contactRepository.findByPhone(phone);
    if (existingByPhone) {
      throw new DuplicateContactPhoneError();
    }

    const contact = Contact.create({
      email,
      id: generateId(),
      isFavorite: params.isFavorite,
      name: params.name,
      phone,
    });

    await this.contactRepository.add(contact);

    return contact;
  }
}
