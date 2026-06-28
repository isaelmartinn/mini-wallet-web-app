export interface TransferAmount {
  add(other: TransferAmount): TransferAmount;
  getValue(): number;
  isGreaterThan(other: { getValue(): number }): boolean;
  isGreaterThanOrEqual(other: { getValue(): number }): boolean;
  isLessThan(other: { getValue(): number }): boolean;
}
