export interface TestTransaction {
  amount: number;
  date: string;
  description: string;
  id: string;
  recipient?: string;
  status: "FAILED" | "PENDING" | "SUCCESS";
  type: "CREDIT" | "DEBIT";
}

export const creditTransaction: TestTransaction = {
  amount: 1500,
  date: new Date().toISOString(),
  description: "Transferencia recibida",
  id: "txn_001",
  recipient: "María García",
  status: "SUCCESS",
  type: "CREDIT",
};

export const debitTransaction: TestTransaction = {
  amount: 500,
  date: new Date(Date.now() - 86400000).toISOString(),
  description: "Transferencia enviada",
  id: "txn_002",
  recipient: "Pedro López",
  status: "SUCCESS",
  type: "DEBIT",
};

export const pendingTransaction: TestTransaction = {
  amount: 250,
  date: new Date(Date.now() - 3600000).toISOString(),
  description: "Pago pendiente",
  id: "txn_003",
  recipient: "Ana Martínez",
  status: "PENDING",
  type: "DEBIT",
};

export const failedTransaction: TestTransaction = {
  amount: 1000,
  date: new Date(Date.now() - 7200000).toISOString(),
  description: "Transferencia fallida",
  id: "txn_004",
  recipient: "Carlos Rodríguez",
  status: "FAILED",
  type: "DEBIT",
};

export const historicalTransactions: TestTransaction[] = [
  {
    amount: 2000,
    date: new Date(Date.now() - 172800000).toISOString(),
    description: "Depósito",
    id: "txn_005",
    status: "SUCCESS",
    type: "CREDIT",
  },
  {
    amount: 350,
    date: new Date(Date.now() - 259200000).toISOString(),
    description: "Pago de servicios",
    id: "txn_006",
    status: "SUCCESS",
    type: "DEBIT",
  },
  {
    amount: 800,
    date: new Date(Date.now() - 345600000).toISOString(),
    description: "Compra en línea",
    id: "txn_007",
    status: "SUCCESS",
    type: "DEBIT",
  },
  {
    amount: 1200,
    date: new Date(Date.now() - 432000000).toISOString(),
    description: "Reembolso",
    id: "txn_008",
    status: "SUCCESS",
    type: "CREDIT",
  },
  {
    amount: 450,
    date: new Date(Date.now() - 518400000).toISOString(),
    description: "Transferencia a contacto",
    id: "txn_009",
    recipient: "Luis Hernández",
    status: "SUCCESS",
    type: "DEBIT",
  },
];

export const allTestTransactions: TestTransaction[] = [
  creditTransaction,
  debitTransaction,
  pendingTransaction,
  failedTransaction,
  ...historicalTransactions,
];

export const newTransactionData = {
  exceedsBalance: 6000,
  invalidAmount: 0,
  largeAmount: 10000,
  negativeAmount: -50,
  validAmount: 100,
};
