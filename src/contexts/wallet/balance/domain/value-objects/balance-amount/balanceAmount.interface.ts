export interface BalanceAmount {
  add(other: BalanceAmount): BalanceAmount;
  getValue(): number;
  isGreaterThan(other: { getValue(): number }): boolean;
  isGreaterThanOrEqual(other: { getValue(): number }): boolean;
  isLessThan(other: { getValue(): number }): boolean;
  subtract(other: BalanceAmount): BalanceAmount;
}
