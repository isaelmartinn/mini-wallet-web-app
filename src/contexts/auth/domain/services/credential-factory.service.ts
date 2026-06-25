import { Email, Phone } from "#auth/domain/value-objects";

export class CredentialFactory {
  static createFromString(value: string): Email | Phone {
    const containsAtSymbol = value.includes("@");

    return containsAtSymbol ? Email.create(value) : Phone.create(value);
  }
}
