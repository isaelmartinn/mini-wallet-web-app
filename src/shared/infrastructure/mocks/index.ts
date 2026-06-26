import contactsData from "./contacts.mock.json";
import mockData from "./users.mock.json";

export type MockContactData = {
  email: string;
  id: string;
  isFavorite: boolean;
  name: string;
  phone: string;
};

export type MockUserData = {
  email: string;
  id: string;
  name: string;
  phone: string;
  wallet: {
    balance: {
      amount: number;
      currency: string;
    };
    fullName: string;
  };
};

export const MOCK_CONTACTS_DATA: MockContactData[] = contactsData.contacts;

export const MOCK_USERS_DATA: MockUserData[] = mockData.users;

export function findMockContactById(
  contactId: string
): MockContactData | undefined {
  return MOCK_CONTACTS_DATA.find((c) => c.id === contactId);
}

export function findMockUserById(userId: string): MockUserData | undefined {
  return MOCK_USERS_DATA.find((u) => u.id === userId);
}
