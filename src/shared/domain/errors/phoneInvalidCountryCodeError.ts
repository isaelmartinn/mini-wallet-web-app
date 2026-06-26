import { DomainError } from "#shared/domain/errors";

export class PhoneInvalidCountryCodeError extends DomainError {
  constructor() {
    super(
      "Phone must have Mexican country code (+52)",
      "PHONE_INVALID_COUNTRY_CODE"
    );
  }
}
