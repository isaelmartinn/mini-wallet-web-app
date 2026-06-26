import { CurrencyFormatter } from "#shared/domain/interfaces";

export class IntlCurrencyFormatter implements CurrencyFormatter {
  constructor(private readonly locale: string = "es-MX") {}

  format(amount: number, currency: string): string {
    return new Intl.NumberFormat(this.locale, {
      currency,
      style: "currency",
    }).format(amount);
  }
}
