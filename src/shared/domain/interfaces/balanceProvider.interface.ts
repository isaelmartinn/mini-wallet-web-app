export interface BalanceProvider {
  getAvailableBalance(userId: string): Promise<number>;
}
