export interface Email {
  equals(other: Email): boolean;
  getValue(): string;
}
