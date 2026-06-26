import { Email, Phone } from "#shared/domain/value-objects";

import {
  Contact as ContactInterface,
  CreateContactParams,
} from "./contact.interface";

export class Contact implements ContactInterface {
  private constructor(
    private readonly email: Email,
    private readonly favorite: boolean,
    private readonly id: string,
    private readonly name: string,
    private readonly phone: Phone
  ) {}

  static create(params: CreateContactParams): Contact {
    return new Contact(
      params.email,
      params.isFavorite,
      params.id,
      params.name,
      params.phone
    );
  }

  getEmail(): Email {
    return this.email;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPhone(): Phone {
    return this.phone;
  }

  isFavorite(): boolean {
    return this.favorite;
  }
}
