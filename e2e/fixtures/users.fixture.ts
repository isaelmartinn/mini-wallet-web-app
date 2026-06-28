export interface TestUser {
  balance: number;
  email: string;
  name: string;
  phone: string;
}

export const testUser: TestUser = {
  balance: 5000,
  email: "juan.perez@example.com",
  name: "Juan Pérez",
  phone: "+525512345678",
};

export const lowBalanceUser: TestUser = {
  balance: 50,
  email: "maria.garcia@example.com",
  name: "María García",
  phone: "+525587654321",
};

export const zeroBalanceUser: TestUser = {
  balance: 0,
  email: "pedro.lopez@example.com",
  name: "Pedro López",
  phone: "+525598765432",
};

export const highBalanceUser: TestUser = {
  balance: 50000,
  email: "ana.martinez@example.com",
  name: "Ana Martínez",
  phone: "+525523456789",
};

export const allTestUsers: TestUser[] = [
  testUser,
  lowBalanceUser,
  zeroBalanceUser,
  highBalanceUser,
];
