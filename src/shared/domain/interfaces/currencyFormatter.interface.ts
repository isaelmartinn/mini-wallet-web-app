export interface CurrencyFormatter {
  format(amount: number, currency: string): string;
}
