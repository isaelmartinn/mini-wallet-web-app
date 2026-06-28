import { Page } from "@playwright/test";

import { allTestTransactions } from "../fixtures";

interface TransferData {
  amount: number;
  date: string;
  description: string;
  id: string;
  recipientId: string;
  status: string;
  type: string;
  userId: string;
}

export async function setupTransactionFixtures(
  page: Page,
  userId: string = "user-1"
): Promise<void> {
  const storageKey = `payments:transfers:${userId}`;

  const transfersData: TransferData[] = allTestTransactions.map((tx) => ({
    amount: tx.amount,
    date: tx.date,
    description: tx.description,
    id: tx.id,
    recipientId: tx.recipient || "unknown",
    status: tx.status,
    type: tx.type === "CREDIT" ? "INCOME" : "EXPENSE",
    userId: userId,
  }));

  await page.evaluate(
    ({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    { data: transfersData, key: storageKey }
  );
}
