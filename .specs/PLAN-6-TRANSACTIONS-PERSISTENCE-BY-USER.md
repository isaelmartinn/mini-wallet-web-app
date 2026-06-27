# Implementation Plan 6: Transactions Persistence by User

> **🚨 CRITICAL PREREQUISITE - READ THIS FIRST 🚨**
>
> **BEFORE starting ANY development work on this plan, you MUST:**
>
> 1. **READ AND FULLY UNDERSTAND** these files at the project root:
>    - `AI_INSTRUCTIONS.md` (1,258 lines) - ALL architectural patterns, conventions, and rules
>    - `DECISIONS.md` (1,540 lines) - ALL architectural decisions and folder structure
>    - `CLAUDE.md` (35 lines) - Critical workflow instructions
> 2. **DO NOT PROCEED** without comprehending these files completely
> 3. **FAILURE TO FOLLOW** the rules in these files will result in:
>    - ❌ Files in wrong locations
>    - ❌ Wrong file naming conventions
>    - ❌ Missing tests
>    - ❌ Relative paths instead of aliases
>    - ❌ Wrong folder structure
>    - ❌ Architectural violations
>
> **This is NOT optional. Read the files NOW before continuing.**

## Context and Objective

**Objective:** Implement user-specific transaction persistence so each user has their own transaction history and balance updates.

### Current Problems

1. ✅ **Balance is being deducted** (working correctly in `confirmTransfer.useCase.ts`)
2. ❌ **Transactions are global** - not associated with specific users
3. ❌ **Fixtures are not user-specific** - all transactions are shared
4. ❌ **URL has unnecessary parameters** - `amount`, `description`, `recipient` in confirmation URL
5. ❌ **Hardcoded userId** - `"user-1"` hardcoded in `ConfirmTransferUseCase` (line 20)
6. ❌ **No transaction persistence by user** - transactions lost on reload

### Expected Behavior

- Each mocked user (`user-1`, `user-2`, `user-3`) has their own transactions
- User creates a new transaction → stored in their personal history
- Transaction completes → deducted from their available balance
- Transaction persists in the user's transaction list
- Available balance persists per user
- Balance reflects on home page
- Transaction history reflects on home page
- Confirmation URL only contains `transferId` query param
- Transfer data retrieved from persistence using `transferId`

---

## Implementation Steps

### **STEP 1: Extend Transfer Domain Entity**

**Goal:** Add `userId` field to Transfer entity to associate transactions with users.

**Files to modify:**

1. `src/contexts/payments/transfer/domain/entities/transfer/transfer.interface.ts`
2. `src/contexts/payments/transfer/domain/entities/transfer/transfer.entity.ts`
3. `src/contexts/payments/transfer/domain/entities/transfer/transfer.entity.spec.ts`

**Changes:**

**File 1: `transfer.interface.ts`**

```typescript
export interface TransferProps {
  amount: number;
  date: Date;
  description: string;
  id: string;
  status: TransferStatus;
  type: TransferType;
  userId: string; // ← ADD THIS
}
```

**File 2: `transfer.entity.ts`**

- Add `private readonly userId: string` to constructor
- Add getter method:
  ```typescript
  getUserId(): string {
    return this.userId;
  }
  ```

**File 3: `transfer.entity.spec.ts`**

- Update all test fixtures to include `userId: "user-1"`
- Add test for `getUserId()` method

---

### **STEP 2: Update Transfer Repository**

**Goal:** Store and retrieve transactions per user using a Map structure.

**Files to modify:**

1. `src/contexts/payments/transfer/domain/repositories/transfer.repository.interface.ts`
2. `src/contexts/payments/transfer/infrastructure/repositories/transfer-repository/transfer.repository.ts`
3. `src/contexts/payments/transfer/infrastructure/repositories/transfer-repository/transfer.fixtures.ts`
4. `src/contexts/payments/transfer/infrastructure/repositories/transfer-repository/transfer.repository.spec.ts`

**Changes:**

**File 1: `transfer.repository.interface.ts`**

```typescript
export interface TransferRepository {
  confirm(transferId: string): Promise<ConfirmTransferResult>;
  create(params: CreateTransferParams): Promise<Transfer>;
  findById(transferId: string): Promise<Transfer | null>; // ← ADD THIS
  findByUserId(userId: string): Promise<Transfer[]>; // ← CHANGE from findAll()
}
```

**File 2: `transfer.repository.ts`**

Key changes:

- Change storage from `Transfer[]` to `Map<string, Transfer[]>` (key = userId)
- Update `create()` to store in Map by userId
- Implement `findByUserId(userId: string)` to return user's transactions
- Implement `findById(transferId: string)` to search across all users
- Update `confirm()` to use `findById()` internally

Example structure:

```typescript
export class TransferRepositoryImpl implements TransferRepository {
  private static instance: TransferRepositoryImpl;
  private static transfersByUser: Map<string, Transfer[]> = new Map();

  // Initialize with fixtures on first instantiation
  constructor() {
    if (TransferRepositoryImpl.instance) {
      return TransferRepositoryImpl.instance;
    }
    TransferRepositoryImpl.instance = this;
    this.initializeFixtures();
  }

  private initializeFixtures(): void {
    if (TransferRepositoryImpl.transfersByUser.size === 0) {
      TRANSACTION_FIXTURES.forEach((transfer) => {
        const userId = transfer.getUserId();
        const userTransfers =
          TransferRepositoryImpl.transfersByUser.get(userId) || [];
        userTransfers.push(transfer);
        TransferRepositoryImpl.transfersByUser.set(userId, userTransfers);
      });
    }
  }

  async findByUserId(userId: string): Promise<Transfer[]> {
    // Simulate delay
    // Return user's transactions or empty array
  }

  async findById(transferId: string): Promise<Transfer | null> {
    // Simulate delay
    // Search across all users for the transferId
  }

  async create(params: CreateTransferParams): Promise<Transfer> {
    // Create transfer with userId
    // Add to Map[userId]
  }
}
```

**File 3: `transfer.fixtures.ts`**

Distribute the 8 existing fixtures among the 3 mocked users:

- `user-1`: 3 transactions (mix of income/expense)
- `user-2`: 3 transactions
- `user-3`: 2 transactions

Update each fixture to include `userId`:

```typescript
Transfer.create({
  amount: 1500.0,
  date: new Date("2024-06-24T10:30:00"),
  description: "Transferencia a María García",
  id: "txn-001",
  status: TransferStatus.success(),
  type: TransferType.expense(),
  userId: "user-1", // ← ADD THIS
}),
```

**File 4: `transfer.repository.spec.ts`**

- Update tests to verify `findByUserId()` returns only user's transactions
- Add tests for `findById()`
- Verify Map storage works correctly

---

### **STEP 3: Update Transfer Use Cases**

**Goal:** Pass `userId` correctly through all use cases.

**Files to modify:**

1. `src/contexts/payments/transfer/application/use-cases/confirm-transfer/confirmTransfer.interface.ts`
2. `src/contexts/payments/transfer/application/use-cases/confirm-transfer/confirmTransfer.useCase.ts`
3. `src/contexts/payments/transfer/application/use-cases/confirm-transfer/confirmTransfer.useCase.spec.ts`
4. `src/contexts/payments/transfer/application/use-cases/get-transfers/getTransfers.interface.ts`
5. `src/contexts/payments/transfer/application/use-cases/get-transfers/getTransfers.useCase.ts`
6. `src/contexts/payments/transfer/application/use-cases/get-transfers/getTransfers.useCase.spec.ts`

**Changes:**

**ConfirmTransferUseCase:**

File: `confirmTransfer.interface.ts`

```typescript
export interface ConfirmTransferParams {
  amount: number;
  transferId: string;
  userId: string; // ← ADD THIS
}
```

File: `confirmTransfer.useCase.ts`

- **CRITICAL:** Remove hardcoded `"user-1"` on line 20
- Change:

  ```typescript
  // ❌ BEFORE
  const currentBalance = await this.walletRepository.getBalance("user-1");

  // ✅ AFTER
  const currentBalance = await this.walletRepository.getBalance(params.userId);
  ```

**GetTransfersUseCase:**

File: `getTransfers.interface.ts`

```typescript
export interface GetTransfersParams {
  userId: string; // ← ADD THIS
}
```

File: `getTransfers.useCase.ts`

- Change from `findAll()` to `findByUserId(params.userId)`

Update all spec files with new parameters.

---

### **STEP 4: Update Confirmation Page**

**Goal:** Simplify URL to only `transferId` and fetch transfer data from persistence.

**Files to modify:**

1. `src/contexts/payments/transfer/infrastructure/ui/pages/confirmation-page/confirmationPage.tsx`
2. `src/contexts/payments/transfer/infrastructure/ui/pages/new-transfer-page/newTransferPage.tsx`

**Changes:**

**File 1: `confirmationPage.tsx`**

Current code (lines 29-32):

```typescript
const transferId = searchParams.get("transferId");
const amount = searchParams.get("amount");
const recipient = searchParams.get("recipient");
const description = searchParams.get("description") || "";
```

**Change to:**

```typescript
const transferId = searchParams.get("transferId");
```

**Add logic to fetch transfer:**

```typescript
// Inside useEffect, before confirmTransfer()
const transferRepository = new TransferRepositoryImpl();
const foundTransfer = await transferRepository.findById(transferId);

if (!foundTransfer) {
  router.push("/home");
  return;
}

// Use foundTransfer data for display
```

**Update ConfirmTransferUseCase call:**

```typescript
const confirmedTransfer = await confirmUseCase.execute({
  amount: foundTransfer.getAmount(), // from fetched transfer
  transferId,
  userId: user.getId(), // from authenticated user
});
```

**Update ReceiptCard:**

```typescript
<ReceiptCard
  amount={confirmedTransfer.getAmount()}
  date={confirmedTransfer.getDate().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
  description={confirmedTransfer.getDescription()}
  recipient={/* Get from contact or transfer */}
  transferId={confirmedTransfer.getId()}
/>
```

**File 2: `newTransferPage.tsx`**

Current code (lines 156-163):

```typescript
const params = new URLSearchParams({
  amount: transferDraft.amount.toString(),
  description: "",
  recipient: selectedContact.getName(),
  transferId: transferDraft.transferId,
});
```

**Change to:**

```typescript
const params = new URLSearchParams({
  transferId: transferDraft.transferId,
});
```

---

### **STEP 5: Update Home Page (if applicable)**

**Goal:** Display user-specific transactions and balance.

**Files to check/modify:**

1. Find the home page component (likely `src/contexts/wallet/infrastructure/ui/pages/home-page/homePage.tsx`)
2. Verify it uses `GetTransfersUseCase` with authenticated user's `userId`
3. Verify balance is fetched with correct `userId`

**Expected code:**

```typescript
const { user } = useAuthContext(authStore);

// Fetch transactions
const getTransfersUseCase = new GetTransfersUseCase(transferRepository);
const transactions = await getTransfersUseCase.execute({
  userId: user.getId(),
});

// Balance should already work correctly via BalanceProvider
```

---

### **STEP 6: Update All Tests**

**Goal:** Ensure all tests pass with new changes.

**Files to update:**

1. All use case spec files (already mentioned in STEP 3)
2. Repository spec files (already mentioned in STEP 2)
3. Entity spec files (already mentioned in STEP 1)

**Test checklist:**

- ✅ Transfer entity has `userId` and `getUserId()` works
- ✅ Repository stores transactions per user in Map
- ✅ `findByUserId()` returns only user's transactions
- ✅ `findById()` finds transfer across all users
- ✅ `create()` adds to correct user's array
- ✅ Use cases pass `userId` correctly
- ✅ Balance updates for correct user

---

## Complete Flow After Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER CREATES TRANSFER                                        │
│    - User (user-1) fills transfer form                          │
│    - PrepareTransferUseCase.execute({ userId: "user-1", ... })  │
│    - TransferRepository.create() → Map["user-1"].push(transfer) │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. NAVIGATE TO CONFIRMATION                                     │
│    - URL: /transactions/confirm?transferId=transfer-xxx         │
│    - Clean URL, no sensitive data                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. CONFIRMATION PAGE LOADS                                      │
│    - Read transferId from URL                                   │
│    - TransferRepository.findById(transferId) → get transfer     │
│    - ConfirmTransferUseCase.execute({                           │
│        userId: "user-1",                                        │
│        transferId,                                              │
│        amount                                                   │
│      })                                                         │
│    - WalletRepository.getBalance("user-1") → current balance    │
│    - Deduct amount from user-1's balance                        │
│    - WalletRepository.updateBalance("user-1", newBalance)       │
│    - Update transfer status to "success"                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. RETURN TO HOME                                               │
│    - GetTransfersUseCase.execute({ userId: "user-1" })          │
│    - TransferRepository.findByUserId("user-1")                  │
│    - Display only user-1's transactions                         │
│    - Display updated balance for user-1                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Structure Example

**Before (Global):**

```typescript
private static transfers: Transfer[] = [
  { id: "txn-001", amount: 1500, ... }, // Who owns this?
  { id: "txn-002", amount: 3200, ... }, // Who owns this?
];
```

**After (Per User):**

```typescript
private static transfersByUser: Map<string, Transfer[]> = new Map([
  ["user-1", [
    { id: "txn-001", amount: 1500, userId: "user-1", ... },
    { id: "txn-002", amount: 3200, userId: "user-1", ... },
  ]],
  ["user-2", [
    { id: "txn-003", amount: 850, userId: "user-2", ... },
  ]],
  ["user-3", [
    { id: "txn-004", amount: 500, userId: "user-3", ... },
  ]],
]);
```

---

## Validation Checklist

Before marking this plan as complete, verify:

- [ ] Each user has their own transaction list
- [ ] Creating a transfer adds to correct user's list
- [ ] Confirmation URL only has `transferId` parameter
- [ ] Transfer data fetched from persistence, not URL
- [ ] Balance deducted from correct user
- [ ] Balance persists per user (already working via WalletRepository)
- [ ] Home page shows user-specific transactions
- [ ] Home page shows correct user balance
- [ ] All tests pass
- [ ] No hardcoded `"user-1"` in use cases
- [ ] Repository uses Map<string, Transfer[]> structure
- [ ] Fixtures distributed among 3 users

---

## Technical Notes

### Singleton Pattern

The `TransferRepositoryImpl` uses Singleton pattern to simulate in-memory persistence. This is correct for mocking a database.

### Map Initialization

Initialize the Map with fixtures on first repository instantiation to ensure data is available immediately.

### Migration Path

This structure makes it easy to migrate to real persistence (database) later:

- Map → Database table with `userId` foreign key
- `findByUserId()` → SQL: `SELECT * FROM transfers WHERE userId = ?`
- `findById()` → SQL: `SELECT * FROM transfers WHERE id = ?`

### Error Handling

Add domain error if transfer not found:

```typescript
// src/contexts/payments/transfer/domain/errors/transferNotFound.error.ts
export class TransferNotFoundError extends DomainError {
  constructor() {
    super("Transfer not found", "TRANSFER_NOT_FOUND");
  }
}
```

---

## Architecture Compliance

This plan follows:

- ✅ **DDD**: Domain changes first, then infrastructure
- ✅ **Hexagonal Architecture**: Repository interface in domain, implementation in infrastructure
- ✅ **Separated Presentation**: UI gets data from use cases, not directly from repositories
- ✅ **Single Responsibility**: Each layer has one reason to change
- ✅ **Open/Closed**: Adding new users doesn't require changing existing code

---

## Implementation Order

**CRITICAL:** Implement in this exact order to avoid breaking changes:

1. STEP 1 (Domain Entity) - Foundation
2. STEP 2 (Repository) - Storage layer
3. STEP 3 (Use Cases) - Business logic
4. STEP 4 (UI Pages) - Presentation
5. STEP 5 (Home Page) - Integration
6. STEP 6 (Tests) - Validation

**DO NOT skip steps or change order.**

---

## Success Criteria

✅ User-1 creates transfer → stored in user-1's list
✅ User-1 confirms transfer → balance deducted from user-1
✅ User-1 sees only their transactions on home
✅ User-2 has different transactions than user-1
✅ URL is clean: `/transactions/confirm?transferId=xxx`
✅ All tests pass
✅ No console errors
✅ TypeScript strict mode passes
✅ ESLint passes
