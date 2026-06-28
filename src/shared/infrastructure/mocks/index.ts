import mockData from "./users.mock.json";

export type MockContactData = {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
};

export type MockTransactionData = {
  amount: number;
  date: string;
  description: string;
  id: string;
  recipientId: string;
  status: "failed" | "pending" | "success";
  type: "expense" | "income";
  userId: string;
};

export type MockUserData = {
  contacts: MockContactData[];
  email: string;
  id: string;
  name: string;
  phone: string;
  transactions: MockTransactionData[];
  wallet: {
    balance: {
      amount: number;
      currency: string;
    };
    fullName: string;
  };
};

export const MOCK_USERS_DATA: MockUserData[] = mockData.users as MockUserData[];

export function findMockContactById(
  contactId: string
): MockContactData | undefined {
  for (const user of MOCK_USERS_DATA) {
    const contact = user.contacts.find((c) => c.id === contactId);
    if (contact) return contact;
  }
  return undefined;
}

export function findMockContactsByUserId(userId: string): MockContactData[] {
  const user = findMockUserById(userId);
  return user?.contacts || [];
}

export function findMockTransactionsByUserId(
  userId: string
): MockTransactionData[] {
  const user = findMockUserById(userId);
  return user?.transactions || [];
}

export function findMockUserById(userId: string): MockUserData | undefined {
  return MOCK_USERS_DATA.find((u) => u.id === userId);
}
