import { EmailEmptyError, EmailInvalidFormatError } from "#auth/domain/errors";

import { Email as EmailInterface } from "./email.interface";

export class Email implements EmailInterface {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new EmailEmptyError();
    }

    if (!this.EMAIL_REGEX.test(trimmedValue)) {
      throw new EmailInvalidFormatError();
    }

    return new Email(trimmedValue.toLowerCase());
  }

  equals(other: EmailInterface): boolean {
    return this.value === other.getValue();
  }

  getValue(): string {
    return this.value;
  }
}
