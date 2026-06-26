import {
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
} from "#shared/domain/errors";

import { Phone as PhoneInterface } from "./phone.interface";

export class Phone implements PhoneInterface {
  private static readonly MEXICAN_COUNTRY_CODE = "+52";
  private static readonly PHONE_REGEX = /^\+52\d{10}$/;

  private constructor(private readonly value: string) {}

  static create(value: string): Phone {
    const cleanedValue = value.replace(/[\s\-()]/g, "");

    if (!cleanedValue) {
      throw new PhoneEmptyError();
    }

    if (!cleanedValue.startsWith(this.MEXICAN_COUNTRY_CODE)) {
      throw new PhoneInvalidCountryCodeError();
    }

    if (!this.PHONE_REGEX.test(cleanedValue)) {
      throw new PhoneInvalidFormatError();
    }

    return new Phone(cleanedValue);
  }

  equals(other: PhoneInterface): boolean {
    return this.value === other.getValue();
  }

  getValue(): string {
    return this.value;
  }
}
