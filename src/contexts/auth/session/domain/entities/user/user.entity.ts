import { Email, Phone } from "#shared/domain/value-objects";

import { User as UserInterface } from "./user.interface";

export interface CreateUserParams {
  email?: Email;
  id: string;
  name: string;
  phone?: Phone;
}

export class User implements UserInterface {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: Email | null,
    private readonly phone: null | Phone
  ) {}

  static create(params: CreateUserParams): User {
    return new User(
      params.id,
      params.name,
      params.email ?? null,
      params.phone ?? null
    );
  }

  getEmail(): Email | null {
    return this.email;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPhone(): null | Phone {
    return this.phone;
  }
}
