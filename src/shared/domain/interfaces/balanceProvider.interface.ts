export interface BalanceProvider {
  getAvailableBalance(userId: string): Promise<number>;
  updateBalance(userId: string, newAmount: number): Promise<void>;
}
