export interface Amount {
  add(other: Amount): Amount;
  getValue(): number;
  isGreaterThan(other: Amount): boolean;
  isGreaterThanOrEqual(other: Amount): boolean;
  isLessThan(other: Amount): boolean;
  subtract(other: Amount): Amount;
}
