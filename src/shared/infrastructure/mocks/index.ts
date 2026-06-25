import mockData from "./users.mock.json";

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

export const MOCK_USERS_DATA: MockUserData[] = mockData.users;

export function findMockUserById(userId: string): MockUserData | undefined {
  return MOCK_USERS_DATA.find((u) => u.id === userId);
}
