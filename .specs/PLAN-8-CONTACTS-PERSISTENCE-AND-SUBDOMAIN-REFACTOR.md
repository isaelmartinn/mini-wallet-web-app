# Implementation Plan 8: Contacts Persistence + Subdomain Refactoring

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

This plan addresses two critical architectural improvements:

1. **Add Contact Persistence**: Implement functionality to add contacts from the new transfer flow, with localStorage persistence so data survives page reloads.

2. **Subdomain Refactoring**: Restructure the `transactions` context into proper subdomain boundaries following DDD principles, separating `transfer` and `contact` concerns.

### Current Problems

- **Mixed Subdomain Concerns**: Transaction and Contact entities are in the same folder structure, violating Bounded Context principles
- **Naming Confusion**: Context and subdomain both named "transactions" creates ambiguity
- **No Contact Persistence**: Contacts are only in-memory (mock), lost on page reload
- **Poor UX**: No way to add contacts from transfer flow; non-favorite contacts hidden from list
- **Value Object Inefficiency**: `create()` method validates already-validated data from localStorage

### Target State

- **Clear Subdomain Separation**: `payments` context with `transfer` and `contact` subdomains
- **Contact Persistence**: Contacts stored in localStorage, survive page reloads
- **Improved UX**: "Add contact" button first in list; contacts sectioned (Favorites + All)
- **Efficient Rehydration**: `rehydrate()` method for Value Objects to skip validation on persisted data

## Architecture and Design

### New Context Structure

```
src/contexts/
  ├── auth/                        (unchanged)
  ├── wallet/                      (unchanged)
  └── payments/                    ← RENAMED from "transactions"
      ├── transfer/                ← Subdomain 1 (formerly mixed in transactions/)
      │   ├── application/
      │   │   └── use-cases/
      │   │       ├── prepare-transfer/
      │   │       └── get-transfers/
      │   ├── domain/
      │   │   ├── entities/
      │   │   │   └── transfer/
      │   │   ├── services/
      │   │   │   └── transfer-validation/
      │   │   ├── errors/
      │   │   └── repositories/
      │   │       └── transfer.repository.interface.ts
      │   └── infrastructure/
      │       ├── repositories/
      │       │   └── transfer-repository/
      │       └── ui/
      │           ├── error-mapper/
      │           └── pages/
      │               └── new-transfer-page/
      │
      └── contact/                 ← Subdomain 2 (formerly mixed in transactions/)
          ├── application/
          │   └── use-cases/
          │       ├── add-contact/
          │       └── get-contacts/
          ├── domain/
          │   ├── entities/
          │   │   └── contact/
          │   ├── errors/
          │   └── repositories/
          │       └── contact.repository.interface.ts
          └── infrastructure/
              ├── repositories/
              │   └── contact-repository/
              │       ├── contact.repository.ts        ← NEW: localStorage implementation
              │       ├── contact.repository.mock.ts
              │       └── contact.fixtures.ts
              └── ui/
                  ├── components/
                  │   └── molecules/
                  │       ├── contact-item/
                  │       └── contact-selector/
                  ├── error-mapper/
                  └── pages/
                      └── add-contact-page/          ← NEW
```

### Path Aliases Update

**Before:**

```json
{
  "#transactions/*": ["src/contexts/transactions/*"]
}
```

**After:**

```json
{
  "#payments/*": ["src/contexts/payments/*"],
  "#payments/transfer/*": ["src/contexts/payments/transfer/*"],
  "#payments/contact/*": ["src/contexts/payments/contact/*"]
}
```

### Value Object Rehydration Pattern

**Problem**: When loading from localStorage, data is already validated. Running `create()` again is redundant and impacts performance.

**Solution**: Add `rehydrate()` static method that skips validation.

```typescript
// Example: Email Value Object
export class Email implements EmailInterface {
  private constructor(private readonly value: string) {}

  // For NEW data from user input - WITH validation
  static create(value: string): Email {
    const trimmedValue = value.trim();
    if (!trimmedValue) throw new EmailEmptyError();
    if (!this.EMAIL_REGEX.test(trimmedValue))
      throw new EmailInvalidFormatError();
    return new Email(trimmedValue.toLowerCase());
  }

  // For PERSISTED data from localStorage - NO validation
  static rehydrate(value: string): Email {
    return new Email(value);
  }
}
```

### Contact Persistence Strategy

- **Storage Key**: `mini-wallet:contacts`
- **Format**: JSON array of serialized contacts
- **Serialization**: Store primitive values (strings, booleans)
- **Deserialization**: Use `rehydrate()` for Value Objects
- **Initialization**: Load mock fixtures on first use if localStorage is empty
- **Error Handling**: Graceful fallback if localStorage unavailable (SSR, private browsing)

### UX Improvements

1. **"Add Contact" Button Position**: First option in contact selector (before list)
2. **Contact List Sections**:
   - ⭐ **Favorites** section (contacts with `isFavorite: true`)
   - 📋 **All Contacts** section (contacts with `isFavorite: false`)
3. **Contact Preselection**: After adding contact, redirect to transfer page with contact preselected via query param

## 🔴 MANDATORY IMPLEMENTATION RULES (STRICTLY ENFORCED)

### **CRITICAL: These rules are NON-NEGOTIABLE. Violations will require complete rework.**

#### **1. File Organization (MANDATORY)**

**✅ CORRECT - Files MUST be in folders:**

```
/use-cases/
  /create-transaction/              ← Folder for use case
    createTransaction.useCase.ts    ← Implementation
    createTransaction.interface.ts  ← Interface
    createTransaction.useCase.spec.ts ← Test
```

**❌ FORBIDDEN - Loose files in folder root:**

```
/use-cases/
  createTransaction.useCase.ts      ← WRONG! Must be in folder
  createTransaction.interface.ts    ← WRONG! Must be in folder
```

**Rule**: EVERY file must be inside a folder. NO loose files at folder root level.

---

#### **2. File Naming Conventions (MANDATORY)**

**Entities**: `{name}.entity.ts` + `{name}.interface.ts` + `{name}.entity.spec.ts`

- ✅ `user.entity.ts`, `user.interface.ts`, `user.entity.spec.ts`
- ❌ `User.ts`, `userEntity.ts`, `user-entity.ts`

**Value Objects**: `{name}.vo.ts` + `{name}.vo.spec.ts`

- ✅ `email.vo.ts`, `email.vo.spec.ts`
- ❌ `Email.ts`, `emailVO.ts`, `email-value-object.ts`

**Use Cases**: `{name}.useCase.ts` + `{name}.interface.ts` + `{name}.useCase.spec.ts`

- ✅ `createTransaction.useCase.ts` (camelCase for name)
- ❌ `CreateTransaction.ts`, `create-transaction.ts`, `createTransactionUseCase.ts`

**Services**: `{name}.service.ts` + `{name}.service.spec.ts`

- ✅ `transactionValidation.service.ts`
- ❌ `TransactionValidation.ts`, `transaction-validation-service.ts`

**Repositories**: `{name}.repository.ts` + `{name}.repository.spec.ts` + `{name}.repository.mock.ts`

- ✅ `transaction.repository.ts`
- ❌ `TransactionRepository.ts`, `transaction-repo.ts`

**Components**: `{name}.tsx` + `{name}.spec.tsx`

- ✅ `loginPage.tsx`, `loginPage.spec.tsx`
- ❌ `LoginPage.tsx`, `login-page.tsx`, `login.page.tsx`

**Errors**: `{name}Error.ts` (camelCase + Error suffix)

- ✅ `insufficientFundsError.ts`
- ❌ `InsufficientFundsError.ts`, `insufficient-funds-error.ts`

**Folder Names**: `kebab-case`

- ✅ `transaction-validation/`, `add-contact/`
- ❌ `TransactionValidation/`, `addContact/`, `transaction_validation/`

---

#### **3. Test Files (MANDATORY)**

**Rule**: EVERY implementation file MUST have a corresponding test file next to it.

**✅ CORRECT:**

```
/entities/
  /user/
    user.entity.ts
    user.interface.ts
    user.entity.spec.ts    ← Test next to implementation
```

**❌ FORBIDDEN:**

```
/entities/
  /user/
    user.entity.ts
    user.interface.ts
  /__tests__/              ← WRONG! No __tests__ folders
    user.entity.spec.ts
```

**Test Structure (BDD - MANDATORY):**

```typescript
describe("CreateTransactionUseCase", () => {
  describe("Given a user with sufficient balance", () => {
    describe("When creating a transaction", () => {
      it("Then should create transaction successfully", () => {
        // Test implementation
      });
    });
  });
});
```

**Mandatory levels:**

1. `describe("SUTName")` - System Under Test
2. `describe("Given [context]")` - Precondition
3. `describe("When [action]")` - Action
4. `it("Then [result]")` - Expected result

---

#### **4. Path Aliases (MANDATORY - NO EXCEPTIONS)**

**✅ CORRECT - ALWAYS use path aliases:**

```typescript
import { User } from "#auth/domain/entities";
import { Email } from "#shared/domain/value-objects";
import { LoginUseCase } from "#auth/application/use-cases";
```

**❌ ABSOLUTELY FORBIDDEN - Relative paths:**

```typescript
import { User } from "../../../domain/entities"; // WRONG!
import { Email } from "../../../../shared/domain"; // WRONG!
import { LoginUseCase } from "../../application"; // WRONG!
```

**Rule**: If you write `../` or `./` in an import, YOU ARE DOING IT WRONG.

**Available aliases:**

- `#auth/*` → `src/contexts/auth/*`
- `#wallet/*` → `src/contexts/wallet/*`
- `#payments/*` → `src/contexts/payments/*`
- `#payments/transfer/*` → `src/contexts/payments/transfer/*`
- `#payments/contact/*` → `src/contexts/payments/contact/*`
- `#shared/*` → `src/shared/*`
- `@/app/*` → `app/*`

---

#### **5. Barrel Exports (MANDATORY)**

**✅ CORRECT - Explicit exports:**

```typescript
// src/contexts/auth/domain/entities/index.ts
export { User } from "./user/user.entity";
export type { User as IUser } from "./user/user.interface";
```

**❌ FORBIDDEN - Wildcard exports:**

```typescript
export * from "./user/user.entity"; // WRONG!
```

**Rule**: NEVER use `export *`. Always explicit exports.

---

#### **6. TypeScript Strict Mode (MANDATORY)**

**❌ FORBIDDEN:**

```typescript
const data: any = getData(); // NO any!
const user = data as { id: string }; // NO inline types!
function process(x) {
  return x;
} // NO implicit types!
```

**✅ CORRECT:**

```typescript
interface UserData {
  id: string;
  name: string;
}

const data: unknown = getData();
const user = data as UserData;
function process(x: string): string {
  return x;
}
```

**Rules:**

- NO `any` types (use `unknown` with type guards)
- NO inline object types with `as { ... }`
- ALL function parameters must have explicit types
- ALL function return types must be explicit

---

#### **7. Chakra UI Usage (MANDATORY)**

**❌ FORBIDDEN - Hardcoded colors:**

```typescript
<Box bg="#1e88e5">                           // WRONG!
<Text color="rgb(30, 136, 229)">           // WRONG!
<Button style={{ backgroundColor: "blue" }}> // WRONG!
```

**✅ CORRECT - Theme tokens:**

```typescript
<Box bg="brand.500">                         // Correct
<Text color="gray.700">                      // Correct
<Button colorScheme="blue">                  // Correct
```

**Rule**: ALWAYS use Chakra UI theme tokens. NEVER hardcode colors.

---

#### **8. Error Handling (MANDATORY)**

**Domain Errors:**

```typescript
// ✅ CORRECT - Custom error class
export class EmailEmptyError extends DomainError {
  constructor() {
    super("Email cannot be empty", "EMAIL_EMPTY");
  }
}

// ❌ FORBIDDEN - Generic Error
throw new Error("Email cannot be empty"); // WRONG!
```

**Error Mappers:**

```typescript
// ✅ CORRECT - Context-specific mapper
export class ContactErrorMapper implements IErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    CONTACT_NAME_EMPTY: {
      title: "Nombre vacío",
      description: "El nombre no puede estar vacío",
    },
  };

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      return ContactErrorMapper.ERROR_MESSAGES[error.code] ?? null;
    }
    return null;
  }

  toFormError(error: unknown): FormErrorMapping | null {
    // Implementation
  }
}
```

**UI Components:**

```typescript
// ✅ CORRECT - Use error handler hook
const { handleError } = useFormErrorHandler({
  form,
  formErrorMappers: [new ContactErrorMapper()],
  presentationMappers: [new ContactErrorMapper()],
});

try {
  await useCase.execute(data);
} catch (error) {
  handleError(error); // Single line!
}
```

**Rules:**

- ALL domain errors MUST extend `DomainError`
- EACH context MUST have its own error mapper
- UI components MUST use `useErrorHandler` or `useFormErrorHandler`
- Catch blocks MUST be single line: `handleError(error)`

---

#### **9. Language Rules (MANDATORY)**

**Code (English ONLY):**

```typescript
// ✅ CORRECT
export class User {
  private readonly name: string;

  getName(): string {
    return this.name;
  }
}
```

**UI Text (Spanish ONLY):**

```typescript
// ✅ CORRECT
<Button>Guardar Contacto</Button>
<Text>El email no puede estar vacío</Text>

// ❌ WRONG
<Button>Save Contact</Button>
<Text>Email cannot be empty</Text>
```

**Rules:**

- Code, variables, functions, classes: **English**
- UI text visible to users: **Spanish**
- Error messages for users: **Spanish**
- Technical error messages (in Error constructor): **English**

---

#### **10. Comments (MANDATORY)**

**❌ FORBIDDEN - Unnecessary comments:**

```typescript
// Get the user name
const name = user.getName();

// Loop through contacts
contacts.forEach((contact) => {
  // Process contact
  processContact(contact);
});
```

**✅ CORRECT - No comments (self-documenting code):**

```typescript
const name = user.getName();

contacts.forEach((contact) => {
  processContact(contact);
});
```

**Rule**: Do NOT add comments unless absolutely necessary for complex logic.

---

#### **11. Dynamic Imports (FORBIDDEN)**

**❌ ABSOLUTELY FORBIDDEN:**

```typescript
const module = await import("#auth/domain/entities"); // WRONG!
import("#auth/domain/entities").User; // WRONG!
```

**✅ CORRECT - Static imports only:**

```typescript
import { User } from "#auth/domain/entities";
```

**Rule**: ALL imports MUST be static at the top of the file.

---

### **Validation Checklist (Check EVERY file you create/modify)**

Before considering any step complete, verify:

- [ ] File is inside a folder (not loose at root)
- [ ] File name follows exact naming convention
- [ ] Test file exists next to implementation
- [ ] Test follows BDD structure (Given-When-Then)
- [ ] ALL imports use path aliases (NO `../`)
- [ ] Barrel exports are explicit (NO `export *`)
- [ ] NO `any` types
- [ ] NO inline types
- [ ] NO hardcoded colors
- [ ] Error handling uses mappers + hooks
- [ ] Code in English, UI text in Spanish
- [ ] NO unnecessary comments
- [ ] NO dynamic imports

**If ANY checkbox is unchecked, the implementation is INCORRECT and must be fixed.**

## Implementation Steps

### Phase 1: Value Object Rehydration

#### Step 1.1: Add `rehydrate()` to Email Value Object

**File**: `src/shared/domain/value-objects/email/email.vo.ts`

**Action**: Add static method `rehydrate()` that bypasses validation.

**Implementation**:

```typescript
static rehydrate(value: string): Email {
  return new Email(value);
}
```

**Validation**:

- Method must be static
- Must return instance of Email
- Must NOT perform any validation
- Constructor remains private

---

#### Step 1.2: Add `rehydrate()` to Phone Value Object

**File**: `src/shared/domain/value-objects/phone/phone.vo.ts`

**Action**: Add static method `rehydrate()` that bypasses validation.

**Implementation**:

```typescript
static rehydrate(value: string): Phone {
  return new Phone(value);
}
```

**Validation**:

- Method must be static
- Must return instance of Phone
- Must NOT perform any validation
- Constructor remains private

---

#### Step 1.3: Add `rehydrate()` to Amount Value Object

**File**: `src/contexts/wallet/domain/value-objects/amount/amount.vo.ts`

**Action**: Add static method `rehydrate()` that bypasses validation.

**Implementation**:

```typescript
static rehydrate(value: number): Amount {
  return new Amount(value);
}
```

**Validation**:

- Method must be static
- Must return instance of Amount
- Must NOT perform any validation
- Constructor remains private

---

### Phase 2: Subdomain Refactoring

#### Step 2.1: Rename Context Folder

**Action**: Rename `src/contexts/transactions/` to `src/contexts/payments/`

**Validation**:

- Folder must be renamed at filesystem level
- All nested folders and files must be moved
- No files should remain in old location

---

#### Step 2.2: Create Subdomain Folder Structure

**Action**: Create subdomain folders inside `payments/`

**Folders to create**:

```
src/contexts/payments/
  ├── transfer/
  │   ├── application/
  │   ├── domain/
  │   └── infrastructure/
  └── contact/
      ├── application/
      ├── domain/
      └── infrastructure/
```

**Validation**:

- All folders must exist
- Each must have proper nested structure (application/domain/infrastructure)

---

#### Step 2.3: Move Transfer-Related Files

**Action**: Move all transaction/transfer related files to `transfer/` subdomain.

**Files to move**:

From `payments/domain/entities/transaction/` → `payments/transfer/domain/entities/transfer/`:

- `transaction.entity.ts` → `transfer.entity.ts`
- `transaction.interface.ts` → `transfer.interface.ts`
- `transaction.entity.spec.ts` → `transfer.entity.spec.ts`

From `payments/domain/services/transaction-validation/` → `payments/transfer/domain/services/transfer-validation/`:

- `transactionValidation.service.ts` → `transferValidation.service.ts`
- `transactionValidation.service.spec.ts` → `transferValidation.service.spec.ts`

From `payments/domain/errors/` → `payments/transfer/domain/errors/`:

- `insufficientFundsError.ts`
- `amountTooLowError.ts`
- All other transfer-related errors

From `payments/domain/repositories/` → `payments/transfer/domain/repositories/`:

- `transaction.repository.interface.ts` → `transfer.repository.interface.ts`

From `payments/application/use-cases/prepare-transaction/` → `payments/transfer/application/use-cases/prepare-transfer/`:

- `prepareTransaction.useCase.ts` → `prepareTransfer.useCase.ts`
- `prepareTransaction.interface.ts` → `prepareTransfer.interface.ts`
- `prepareTransaction.useCase.spec.ts` → `prepareTransfer.useCase.spec.ts`

From `payments/application/use-cases/get-transactions/` → `payments/transfer/application/use-cases/get-transfers/`:

- `getTransactions.useCase.ts` → `getTransfers.useCase.ts`
- `getTransactions.interface.ts` → `getTransfers.interface.ts`
- `getTransactions.useCase.spec.ts` → `getTransfers.useCase.spec.ts`

From `payments/infrastructure/repositories/transaction-repository/` → `payments/transfer/infrastructure/repositories/transfer-repository/`:

- `transaction.repository.ts` → `transfer.repository.ts`
- `transaction.fixtures.ts` → `transfer.fixtures.ts`
- `transaction.repository.spec.ts` → `transfer.repository.spec.ts`

From `payments/infrastructure/ui/pages/new-transaction-page/` → `payments/transfer/infrastructure/ui/pages/new-transfer-page/`:

- `newTransactionPage.tsx` → `newTransferPage.tsx`
- `newTransactionPage.spec.tsx` → `newTransferPage.spec.tsx`

From `payments/infrastructure/ui/error-mapper/` → `payments/transfer/infrastructure/ui/error-mapper/`:

- `transactionFormErrorMapper.ts` → `transferFormErrorMapper.ts`

**Validation**:

- All files must be in new locations
- File names must be updated (transaction → transfer)
- Class/interface names inside files must be updated

---

#### Step 2.4: Move Contact-Related Files

**Action**: Move all contact-related files to `contact/` subdomain.

**Files to move**:

From `payments/domain/entities/contact/` → `payments/contact/domain/entities/contact/`:

- `contact.entity.ts`
- `contact.interface.ts`
- `contact.entity.spec.ts`

From `payments/domain/errors/` → `payments/contact/domain/errors/`:

- `contactNameEmptyError.ts`

From `payments/domain/repositories/` → `payments/contact/domain/repositories/`:

- `contact.repository.interface.ts`

From `payments/application/use-cases/add-contact/` → `payments/contact/application/use-cases/add-contact/`:

- `addContact.useCase.ts`
- `addContact.interface.ts`
- `addContact.useCase.spec.ts`

From `payments/application/use-cases/get-contacts/` → `payments/contact/application/use-cases/get-contacts/`:

- `getContacts.useCase.ts`
- `getContacts.interface.ts`

From `payments/infrastructure/repositories/contact-repository/` → `payments/contact/infrastructure/repositories/contact-repository/`:

- `contact.repository.mock.ts`
- `contact.fixtures.ts`

From `payments/infrastructure/ui/components/molecules/contact-item/` → `payments/contact/infrastructure/ui/components/molecules/contact-item/`:

- `contactItem.tsx`
- `contactItem.spec.tsx`
- `index.ts`

From `payments/infrastructure/ui/components/molecules/contact-selector/` → `payments/contact/infrastructure/ui/components/molecules/contact-selector/`:

- `contactSelector.tsx`
- `contactSelector.spec.tsx`
- `index.ts`

**Validation**:

- All files must be in new locations
- Folder structure must match subdomain pattern

---

#### Step 2.5: Update Path Aliases in tsconfig.json

**File**: `tsconfig.json`

**Action**: Update path aliases to reflect new structure.

**Changes**:

```json
{
  "compilerOptions": {
    "paths": {
      "#auth/*": ["src/contexts/auth/*"],
      "#wallet/*": ["src/contexts/wallet/*"],
      "#payments/*": ["src/contexts/payments/*"],
      "#payments/transfer/*": ["src/contexts/payments/transfer/*"],
      "#payments/contact/*": ["src/contexts/payments/contact/*"],
      "#shared/*": ["src/shared/*"],
      "@/app/*": ["app/*"]
    }
  }
}
```

**Validation**:

- Old `#transactions/*` alias must be removed
- New aliases must be added
- Paths must point to correct directories

---

#### Step 2.6: Update All Imports Across Codebase

**Action**: Update all import statements to use new path aliases.

**Search and replace patterns**:

1. `#transactions/domain/entities` → `#payments/transfer/domain/entities` (for Transfer)
2. `#transactions/domain/entities` → `#payments/contact/domain/entities` (for Contact)
3. `#transactions/application/use-cases` → `#payments/transfer/application/use-cases` (for transfer use cases)
4. `#transactions/application/use-cases` → `#payments/contact/application/use-cases` (for contact use cases)
5. `#transactions/domain/services` → `#payments/transfer/domain/services`
6. `#transactions/domain/repositories` → `#payments/transfer/domain/repositories` (for TransferRepository)
7. `#transactions/domain/repositories` → `#payments/contact/domain/repositories` (for ContactRepository)
8. `#transactions/infrastructure` → `#payments/transfer/infrastructure` (for transfer infrastructure)
9. `#transactions/infrastructure` → `#payments/contact/infrastructure` (for contact infrastructure)

**Files to check** (non-exhaustive, use global search):

- All files in `src/contexts/payments/`
- `app/(dashboard)/transactions/new/page.tsx`
- Any test files importing from transactions

**Validation**:

- No import errors when running TypeScript compiler
- All imports resolve correctly
- No references to old `#transactions` alias remain

---

#### Step 2.7: Rename Classes and Interfaces

**Action**: Rename Transaction → Transfer in class/interface names.

**Files and changes**:

1. `payments/transfer/domain/entities/transfer/transfer.entity.ts`:
   - `Transaction` → `Transfer`
   - `CreateTransactionParams` → `CreateTransferParams`

2. `payments/transfer/domain/entities/transfer/transfer.interface.ts`:
   - `Transaction` → `Transfer`
   - `CreateTransactionParams` → `CreateTransferParams`

3. `payments/transfer/domain/services/transfer-validation/transferValidation.service.ts`:
   - `TransactionValidationService` → `TransferValidationService`

4. `payments/transfer/domain/repositories/transfer.repository.interface.ts`:
   - `TransactionRepository` → `TransferRepository`

5. `payments/transfer/application/use-cases/prepare-transfer/prepareTransfer.useCase.ts`:
   - `PrepareTransactionUseCase` → `PrepareTransferUseCase`
   - `PrepareTransactionParams` → `PrepareTransferParams`
   - `PrepareTransactionResult` → `PrepareTransferResult`

6. `payments/transfer/application/use-cases/get-transfers/getTransfers.useCase.ts`:
   - `GetTransactionsUseCase` → `GetTransfersUseCase`

7. `payments/transfer/infrastructure/repositories/transfer-repository/transfer.repository.ts`:
   - `TransactionRepository` → `TransferRepository`

8. `payments/transfer/infrastructure/ui/pages/new-transfer-page/newTransferPage.tsx`:
   - `NewTransactionPage` → `NewTransferPage`
   - `NewTransactionPageProps` → `NewTransferPageProps`
   - `NewTransactionFormData` → `NewTransferFormData`
   - `newTransactionSchema` → `newTransferSchema`

9. `payments/transfer/infrastructure/ui/error-mapper/transferFormErrorMapper.ts`:
   - `TransactionFormErrorMapper` → `TransferFormErrorMapper`

**Validation**:

- All class/interface names updated
- No references to old names remain
- TypeScript compiles without errors

---

#### Step 2.8: Update Barrel Exports (index.ts)

**Action**: Create/update barrel exports for each subdomain.

**Files to create/update**:

1. `src/contexts/payments/transfer/domain/entities/index.ts`:

```typescript
export { Transfer } from "./transfer/transfer.entity";
export type {
  CreateTransferParams,
  Transfer as ITransfer,
} from "./transfer/transfer.interface";
```

2. `src/contexts/payments/transfer/domain/repositories/index.ts`:

```typescript
export type { TransferRepository } from "./transfer.repository.interface";
```

3. `src/contexts/payments/transfer/application/use-cases/index.ts`:

```typescript
export { PrepareTransferUseCase } from "./prepare-transfer/prepareTransfer.useCase";
export type {
  PrepareTransferParams,
  PrepareTransferResult,
  PrepareTransferUseCase as IPrepareTransferUseCase,
} from "./prepare-transfer/prepareTransfer.interface";
export { GetTransfersUseCase } from "./get-transfers/getTransfers.useCase";
export type { GetTransfersUseCase as IGetTransfersUseCase } from "./get-transfers/getTransfers.interface";
```

4. `src/contexts/payments/transfer/infrastructure/repositories/index.ts`:

```typescript
export { TransferRepository } from "./transfer-repository/transfer.repository";
```

5. `src/contexts/payments/transfer/infrastructure/ui/pages/index.ts`:

```typescript
export { NewTransferPage } from "./new-transfer-page/newTransferPage";
```

6. `src/contexts/payments/contact/domain/entities/index.ts`:

```typescript
export { Contact } from "./contact/contact.entity";
export type {
  Contact as IContact,
  CreateContactParams,
} from "./contact/contact.interface";
```

7. `src/contexts/payments/contact/domain/repositories/index.ts`:

```typescript
export type { ContactRepository } from "./contact.repository.interface";
```

8. `src/contexts/payments/contact/application/use-cases/index.ts`:

```typescript
export { AddContactUseCase } from "./add-contact/addContact.useCase";
export type {
  AddContactParams,
  AddContactUseCase as IAddContactUseCase,
} from "./add-contact/addContact.interface";
export { GetContactsUseCase } from "./get-contacts/getContacts.useCase";
export type { GetContactsUseCase as IGetContactsUseCase } from "./get-contacts/getContacts.interface";
```

9. `src/contexts/payments/contact/infrastructure/repositories/index.ts`:

```typescript
export { ContactRepository } from "./contact-repository/contact.repository";
export { ContactRepositoryMock } from "./contact-repository/contact.repository.mock";
```

10. `src/contexts/payments/contact/infrastructure/ui/components/index.ts`:

```typescript
export { ContactItem } from "./molecules/contact-item/contactItem";
export { ContactSelector } from "./molecules/contact-selector/contactSelector";
```

11. `src/contexts/payments/contact/infrastructure/ui/pages/index.ts`:

```typescript
export { AddContactPage } from "./add-contact-page/addContactPage";
```

**Validation**:

- All barrel exports use explicit exports (no `export *`)
- Exports match actual file names and exports
- No circular dependencies

---

### Phase 3: Contact Persistence Implementation

#### Step 3.1: Create Contact Repository with localStorage

**File**: `src/contexts/payments/contact/infrastructure/repositories/contact-repository/contact.repository.ts`

**Action**: Create real repository implementation with localStorage persistence.

**Implementation**:

```typescript
import { Email, Phone } from "#shared/domain/value-objects";
import { Contact } from "#payments/contact/domain/entities";
import { ContactRepository as ContactRepositoryInterface } from "#payments/contact/domain/repositories";
import { MOCK_CONTACTS } from "./contact.fixtures";

interface StoredContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  isFavorite: boolean;
}

export class ContactRepository implements ContactRepositoryInterface {
  private readonly STORAGE_KEY = "mini-wallet:contacts";

  async add(contact: Contact): Promise<void> {
    const stored = this.getFromStorage();

    stored.push({
      id: contact.getId(),
      name: contact.getName(),
      email: contact.getEmail().getValue(),
      phone: contact.getPhone().getValue(),
      isFavorite: contact.isFavorite(),
    });

    this.saveToStorage(stored);
  }

  async findAll(): Promise<Contact[]> {
    const stored = this.getFromStorage();

    return stored.map((item) =>
      Contact.create({
        id: item.id,
        name: item.name,
        email: Email.rehydrate(item.email),
        phone: Phone.rehydrate(item.phone),
        isFavorite: item.isFavorite,
      })
    );
  }

  async findById(id: string): Promise<Contact | null> {
    const stored = this.getFromStorage();
    const item = stored.find((c) => c.id === id);

    if (!item) return null;

    return Contact.create({
      id: item.id,
      name: item.name,
      email: Email.rehydrate(item.email),
      phone: Phone.rehydrate(item.phone),
      isFavorite: item.isFavorite,
    });
  }

  async findFavorites(): Promise<Contact[]> {
    const all = await this.findAll();
    return all.filter((c) => c.isFavorite());
  }

  private getFromStorage(): StoredContact[] {
    if (typeof window === "undefined") {
      return this.getInitialContacts();
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);

      if (!data) {
        const initial = this.getInitialContacts();
        this.saveToStorage(initial);
        return initial;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to load contacts from localStorage", error);
      return this.getInitialContacts();
    }
  }

  private saveToStorage(contacts: StoredContact[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error("Failed to save contacts to localStorage", error);
    }
  }

  private getInitialContacts(): StoredContact[] {
    return MOCK_CONTACTS.map((contact) => ({
      id: contact.getId(),
      name: contact.getName(),
      email: contact.getEmail().getValue(),
      phone: contact.getPhone().getValue(),
      isFavorite: contact.isFavorite(),
    }));
  }
}
```

**Validation**:

- Repository implements `ContactRepositoryInterface`
- Uses `Email.rehydrate()` and `Phone.rehydrate()` when loading from storage
- Handles SSR case (typeof window check)
- Initializes with mock data on first use
- Graceful error handling for localStorage failures
- All methods are async (return Promise)

---

#### Step 3.2: Update Contact Repository Barrel Export

**File**: `src/contexts/payments/contact/infrastructure/repositories/index.ts`

**Action**: Export the new ContactRepository.

**Implementation**:

```typescript
export { ContactRepository } from "./contact-repository/contact.repository";
export { ContactRepositoryMock } from "./contact-repository/contact.repository.mock";
```

**Validation**:

- Both repositories exported
- Explicit exports (no `export *`)

---

### Phase 4: Add Contact Page Implementation

#### Step 4.1: Create Add Contact Schema

**File**: `src/contexts/payments/contact/infrastructure/ui/schemas/addContact.schema.ts`

**Action**: Create Zod schema for form validation.

**Implementation**:

```typescript
import { z } from "zod";

export const addContactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  isFavorite: z.boolean(),
});

export type AddContactFormData = z.infer<typeof addContactSchema>;
```

**Validation**:

- Schema validates all required fields
- Error messages in Spanish
- Type exported for form usage

---

#### Step 4.2: Create Add Contact Page Component

**File**: `src/contexts/payments/contact/infrastructure/ui/pages/add-contact-page/addContactPage.tsx`

**Action**: Create page component with form to add new contact.

**Implementation**:

```typescript
"use client";

import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, Phone as PhoneIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Email, Phone } from "#shared/domain/value-objects";
import { useFormErrorHandler } from "#shared/infrastructure/ui/hooks";
import { AddContactUseCase } from "#payments/contact/application/use-cases";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import {
  addContactSchema,
  AddContactFormData,
} from "../../schemas/addContact.schema";
import { ContactErrorMapper } from "../../error-mapper/contactErrorMapper";

interface AddContactPageProps {
  contactRepository: ContactRepository;
}

export function AddContactPage({ contactRepository }: AddContactPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      isFavorite: false,
    },
    mode: "onChange",
    resolver: zodResolver(addContactSchema),
  });

  const errorMappers = useMemo(() => [new ContactErrorMapper()], []);
  const { handleError } = useFormErrorHandler({
    form,
    formErrorMappers: errorMappers,
    presentationMappers: errorMappers,
  });

  const onSubmit = async (data: AddContactFormData) => {
    setIsSubmitting(true);
    try {
      const email = Email.create(data.email);
      const phone = Phone.create(data.phone);

      const addContactUseCase = new AddContactUseCase(contactRepository);
      const contact = await addContactUseCase.execute({
        name: data.name,
        email: data.email,
        phone: data.phone,
        isFavorite: data.isFavorite,
      });

      router.push(`/transactions/new?contactId=${contact.getId()}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <HStack>
            <Button
              colorScheme="gray"
              onClick={handleBack}
              size="sm"
              variant="ghost"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading size="lg">Agregar Contacto</Heading>
          </HStack>

          <Card.Root>
            <Card.Body p={6}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack align="stretch" gap={4}>
                  <FormControl
                    isInvalid={!!form.formState.errors.name}
                    isRequired
                  >
                    <FormLabel>Nombre</FormLabel>
                    <HStack>
                      <Box color="gray.500">
                        <User size={20} />
                      </Box>
                      <Input
                        {...form.register("name")}
                        disabled={isSubmitting}
                        placeholder="Nombre completo"
                      />
                    </HStack>
                    {form.formState.errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {form.formState.errors.name.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!form.formState.errors.email}
                    isRequired
                  >
                    <FormLabel>Email</FormLabel>
                    <HStack>
                      <Box color="gray.500">
                        <Mail size={20} />
                      </Box>
                      <Input
                        {...form.register("email")}
                        disabled={isSubmitting}
                        placeholder="correo@ejemplo.com"
                        type="email"
                      />
                    </HStack>
                    {form.formState.errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {form.formState.errors.email.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!form.formState.errors.phone}
                    isRequired
                  >
                    <FormLabel>Teléfono</FormLabel>
                    <HStack>
                      <Box color="gray.500">
                        <PhoneIcon size={20} />
                      </Box>
                      <Input
                        {...form.register("phone")}
                        disabled={isSubmitting}
                        placeholder="+52 55 1234 5678"
                      />
                    </HStack>
                    {form.formState.errors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {form.formState.errors.phone.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <HStack justify="space-between">
                      <FormLabel mb={0}>Marcar como favorito</FormLabel>
                      <Switch
                        {...form.register("isFavorite")}
                        disabled={isSubmitting}
                      />
                    </HStack>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    loading={isSubmitting}
                    mt={2}
                    size="lg"
                    type="submit"
                    width="full"
                  >
                    Guardar Contacto
                  </Button>
                </VStack>
              </form>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}
```

**Validation**:

- Uses Chakra UI components
- Form validation with React Hook Form + Zod
- Domain validation with `Email.create()` and `Phone.create()`
- Error handling with `useFormErrorHandler`
- Loading state during submission
- Redirects to transfer page with contactId query param
- All UI text in Spanish
- Icons from lucide-react

---

#### Step 4.3: Create Add Contact Page Barrel Export

**File**: `src/contexts/payments/contact/infrastructure/ui/pages/add-contact-page/index.ts`

**Action**: Export the page component.

**Implementation**:

```typescript
export { AddContactPage } from "./addContactPage";
```

**Validation**:

- Explicit export

---

#### Step 4.4: Create Contact Error Mapper

**File**: `src/contexts/payments/contact/infrastructure/ui/error-mapper/contactErrorMapper.ts`

**Action**: Create error mapper for contact domain errors.

**Implementation**:

```typescript
import { DomainError } from "#shared/domain/errors";
import {
  ErrorPresentation,
  FormErrorMapping,
  IErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";

export class ContactErrorMapper implements IErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    CONTACT_NAME_EMPTY: {
      title: "Nombre vacío",
      description: "El nombre del contacto no puede estar vacío",
    },
    EMAIL_EMPTY: {
      title: "Email vacío",
      description: "El email no puede estar vacío",
    },
    EMAIL_INVALID_FORMAT: {
      title: "Email inválido",
      description: "El formato del email no es válido",
    },
    PHONE_EMPTY: {
      title: "Teléfono vacío",
      description: "El teléfono no puede estar vacío",
    },
    PHONE_INVALID_FORMAT: {
      title: "Teléfono inválido",
      description:
        "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
    },
    PHONE_INVALID_COUNTRY_CODE: {
      title: "Código de país inválido",
      description: "El teléfono debe comenzar con +52 (México)",
    },
  };

  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    CONTACT_NAME_EMPTY: {
      field: "name",
      message: "El nombre no puede estar vacío",
    },
    EMAIL_EMPTY: { field: "email", message: "El email no puede estar vacío" },
    EMAIL_INVALID_FORMAT: {
      field: "email",
      message: "El formato del email no es válido",
    },
    PHONE_EMPTY: {
      field: "phone",
      message: "El teléfono no puede estar vacío",
    },
    PHONE_INVALID_FORMAT: {
      field: "phone",
      message: "Formato inválido. Usa +52 seguido de 10 dígitos",
    },
    PHONE_INVALID_COUNTRY_CODE: {
      field: "phone",
      message: "Debe comenzar con +52",
    },
  };

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      const presentation = ContactErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation;
      }

      return {
        title: "Error de validación",
        description: error.message,
      };
    }

    return null;
  }

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      return ContactErrorMapper.FORM_ERROR_MAPPINGS[error.code] ?? null;
    }

    return null;
  }
}
```

**Validation**:

- Implements `IErrorMapper` interface
- Maps all contact-related domain errors
- Provides both toast and form error mappings
- All messages in Spanish

---

### Phase 5: Next.js Routes

#### Step 5.1: Create Add Contact Route

**File**: `app/(dashboard)/transactions/contacts/new/page.tsx`

**Action**: Create Next.js route for add contact page.

**Implementation**:

```typescript
"use client";

import { AddContactPage } from "#payments/contact/infrastructure/ui/pages";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";

const contactRepository = new ContactRepository();

export default function AddContactRoute() {
  return <AddContactPage contactRepository={contactRepository} />;
}
```

**Validation**:

- File has `"use client"` directive
- Uses real `ContactRepository` (not mock)
- Instantiates repository at module level

---

#### Step 5.2: Update New Transfer Route

**File**: `app/(dashboard)/transactions/new/page.tsx`

**Action**: Update imports and component names to reflect refactoring.

**Changes**:

```typescript
"use client";

import { useAuthStore } from "#auth/infrastructure/store";
import { NewTransferPage } from "#payments/transfer/infrastructure/ui/pages";
import { BalanceProviderAdapter } from "#wallet/infrastructure/providers/balance-provider/balance-provider.adapter";
import { WalletRepository } from "#wallet/infrastructure/repositories";

const walletRepository = new WalletRepository();
const balanceProvider = new BalanceProviderAdapter(walletRepository);

export default function NewTransferRoute() {
  return (
    <NewTransferPage
      authStore={useAuthStore}
      balanceProvider={balanceProvider}
    />
  );
}
```

**Validation**:

- Imports updated to new path aliases
- Component renamed to `NewTransferPage`
- No other logic changes

---

### Phase 6: Contact Selector Improvements

#### Step 6.1: Update Contact Selector Component

**File**: `src/contexts/payments/contact/infrastructure/ui/components/molecules/contact-selector/contactSelector.tsx`

**Action**: Add "Add Contact" button first and section contacts by favorites.

**Implementation**:

```typescript
import {
  Box,
  Button,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Star, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Contact } from "#payments/contact/domain/entities";
import { ContactItem } from "../contact-item";

interface ContactSelectorProps {
  contacts: Contact[];
  disabled?: boolean;
  isLoading: boolean;
  onSelect: (contact: Contact) => void;
  selectedContact: Contact | null;
}

export function ContactSelector({
  contacts,
  disabled = false,
  isLoading,
  onSelect,
  selectedContact,
}: ContactSelectorProps) {
  const router = useRouter();

  const favoriteContacts = contacts.filter((c) => c.isFavorite());
  const regularContacts = contacts.filter((c) => !c.isFavorite());

  const handleAddContact = () => {
    router.push("/transactions/contacts/new");
  };

  if (isLoading) {
    return (
      <VStack align="stretch" gap={2}>
        {[1, 2, 3].map((i) => (
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            key={i}
            p={4}
          >
            <HStack gap={3}>
              <Skeleton borderRadius="full" height="40px" width="40px" />
              <VStack align="flex-start" flex={1} gap={1.5}>
                <Skeleton height="16px" width="120px" />
                <Skeleton height="14px" width="200px" />
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      {/* Add Contact Button - FIRST */}
      <Button
        colorScheme="blue"
        disabled={disabled}
        leftIcon={<UserPlus size={20} />}
        onClick={handleAddContact}
        variant="outline"
        width="full"
      >
        Agregar nuevo contacto
      </Button>

      {/* Favorites Section */}
      {favoriteContacts.length > 0 && (
        <Box>
          <HStack mb={2}>
            <Star fill="gold" size={16} stroke="gold" />
            <Text color="gray.700" fontSize="sm" fontWeight="bold">
              Favoritos
            </Text>
          </HStack>
          <VStack align="stretch" gap={2}>
            {favoriteContacts.map((contact) => (
              <ContactItem
                contact={contact}
                disabled={disabled}
                isSelected={selectedContact?.getId() === contact.getId()}
                key={contact.getId()}
                onSelect={onSelect}
              />
            ))}
          </VStack>
        </Box>
      )}

      {/* All Contacts Section */}
      {regularContacts.length > 0 && (
        <Box>
          <Text color="gray.700" fontSize="sm" fontWeight="bold" mb={2}>
            Todos los contactos
          </Text>
          <VStack align="stretch" gap={2}>
            {regularContacts.map((contact) => (
              <ContactItem
                contact={contact}
                disabled={disabled}
                isSelected={selectedContact?.getId() === contact.getId()}
                key={contact.getId()}
                onSelect={onSelect}
              />
            ))}
          </VStack>
        </Box>
      )}

      {/* Empty State */}
      {contacts.length === 0 && (
        <Box bg="gray.50" borderRadius="md" p={4} textAlign="center">
          <Text color="gray.600">No hay contactos disponibles</Text>
        </Box>
      )}
    </VStack>
  );
}
```

**Validation**:

- "Add Contact" button appears first
- Contacts sectioned into Favorites and All Contacts
- Favorites section only shown if there are favorites
- All Contacts section only shown if there are non-favorites
- Empty state shown if no contacts at all
- Uses lucide-react icons (Star, UserPlus)
- All text in Spanish

---

### Phase 7: Transfer Page Contact Preselection

#### Step 7.1: Update New Transfer Page with Preselection

**File**: `src/contexts/payments/transfer/infrastructure/ui/pages/new-transfer-page/newTransferPage.tsx`

**Action**: Add logic to preselect contact from query param.

**Changes to add**:

1. Import `useSearchParams`:

```typescript
import { useRouter, useSearchParams } from "next/navigation";
```

2. Add searchParams hook:

```typescript
const searchParams = useSearchParams();
```

3. Add useEffect for preselection (after contacts are loaded):

```typescript
useEffect(() => {
  const preselectedContactId = searchParams.get("contactId");

  if (preselectedContactId && contacts.length > 0 && !selectedContact) {
    const contact = contacts.find((c) => c.getId() === preselectedContactId);

    if (contact) {
      handleContactSelect(contact);
      // Clear query param
      router.replace("/transactions/new", { scroll: false });
    }
  }
}, [searchParams, contacts, selectedContact, handleContactSelect, router]);
```

4. Update repository instantiation to use real ContactRepository:

```typescript
const contactRepository = new ContactRepository();
```

**Validation**:

- Contact is preselected when contactId query param present
- Query param is cleared after preselection
- Only runs if contact not already selected
- Uses real ContactRepository instead of mock

---

### Phase 8: Final Validations

#### Step 8.1: Run TypeScript Compiler

**Action**: Verify no TypeScript errors.

**Command**: `npm run type-check` or `tsc --noEmit`

**Validation**:

- No TypeScript errors
- All imports resolve
- All types are correct

---

#### Step 8.2: Run Linter

**Action**: Run ESLint and fix auto-fixable issues.

**Command**: `npm run lint -- --fix`

**Validation**:

- No ESLint errors
- Code is properly sorted (eslint-plugin-perfectionist)
- No boundary violations (eslint-plugin-boundaries)

---

#### Step 8.3: Run Tests

**Action**: Run all tests to ensure nothing broke.

**Command**: `npm test`

**Validation**:

- All existing tests pass
- No test failures introduced by refactoring

---

#### Step 8.4: Manual Testing Checklist

**Actions to test manually**:

1. **Add Contact Flow**:
   - Navigate to `/transactions/new`
   - Click "Agregar nuevo contacto" button
   - Fill form with valid data
   - Submit form
   - Verify redirect to `/transactions/new` with contact preselected
   - Verify contact appears in list

2. **Contact Persistence**:
   - Add a new contact
   - Reload page
   - Verify contact still exists in list

3. **Contact Sections**:
   - Verify favorites appear in "Favoritos" section
   - Verify non-favorites appear in "Todos los contactos" section
   - Add contact as favorite, verify it appears in Favorites section
   - Add contact as non-favorite, verify it appears in All Contacts section

4. **Form Validation**:
   - Try submitting empty form, verify validation errors
   - Try invalid email, verify error
   - Try invalid phone, verify error
   - Verify errors appear both as toast and inline

5. **localStorage**:
   - Open browser DevTools → Application → Local Storage
   - Verify `mini-wallet:contacts` key exists
   - Verify data is JSON array
   - Add contact, verify localStorage updates

**Validation**:

- All manual tests pass
- No console errors
- UI behaves as expected

---

## Acceptance Criteria

### Functional Requirements

- [ ] User can click "Agregar nuevo contacto" button from contact selector
- [ ] "Agregar nuevo contacto" button appears FIRST in the list
- [ ] Form displays with fields: name, email, phone, isFavorite
- [ ] Form validation works (UI layer with Zod)
- [ ] Domain validation works (Email.create(), Phone.create())
- [ ] Contact is saved to localStorage on submit
- [ ] User is redirected to `/transactions/new` with contact preselected
- [ ] Contact appears in contact list after adding
- [ ] Contacts persist after page reload
- [ ] Contact list is sectioned: "Favoritos" and "Todos los contactos"
- [ ] Favorite contacts appear in Favorites section
- [ ] Non-favorite contacts appear in All Contacts section
- [ ] Both sections are shown when applicable

### Technical Requirements

- [ ] Context renamed from `transactions` to `payments`
- [ ] Subdomain structure created: `transfer/` and `contact/`
- [ ] All files moved to correct subdomain folders
- [ ] All imports updated to new path aliases
- [ ] All class/interface names updated (Transaction → Transfer)
- [ ] `rehydrate()` method added to Email, Phone, and Amount VOs
- [ ] ContactRepository uses `rehydrate()` when loading from localStorage
- [ ] ContactRepository uses real localStorage (not mock)
- [ ] localStorage handles SSR case gracefully
- [ ] Error mapper created for contact domain
- [ ] All barrel exports use explicit exports (no `export *`)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests pass

### Non-Functional Requirements

- [ ] UI is modern and consistent with rest of app (Chakra UI)
- [ ] Form is centered with proper spacing
- [ ] Error messages are clear and in Spanish
- [ ] Loading states are visible
- [ ] Navigation is smooth without context loss
- [ ] Sections are clearly differentiated with titles and icons

## Risks and Mitigations

| Risk                            | Impact | Mitigation                                             |
| ------------------------------- | ------ | ------------------------------------------------------ |
| localStorage unavailable (SSR)  | High   | Check `typeof window !== "undefined"` before using     |
| Corrupted data in localStorage  | Medium | Try-catch when deserializing + fallback to empty array |
| Import errors after refactoring | High   | Use global search/replace, run TypeScript compiler     |
| Test failures after refactoring | Medium | Update test imports, re-run tests frequently           |
| Missing files after move        | High   | Use git mv to preserve history, verify all files moved |

## Notes for Implementation

- **Order matters**: Complete Phase 1 (rehydrate) before Phase 2 (refactoring)
- **Test frequently**: Run TypeScript compiler after each major change
- **Use git**: Commit after each phase to enable rollback if needed
- **Search/Replace**: Use IDE's global search/replace for import updates
- **Barrel exports**: Update barrel exports immediately after moving files
- **Don't skip validations**: Each step has validation criteria for a reason

## Estimated Effort

- **Phase 1** (Value Object rehydration): 30 minutes
- **Phase 2** (Subdomain refactoring): 2-3 hours
- **Phase 3** (Contact persistence): 1 hour
- **Phase 4** (Add contact page): 1.5 hours
- **Phase 5** (Routes): 30 minutes
- **Phase 6** (Contact selector improvements): 1 hour
- **Phase 7** (Preselection): 30 minutes
- **Phase 8** (Validations): 1 hour

**Total**: ~8-9 hours

## Success Metrics

- All acceptance criteria met
- No TypeScript errors
- No ESLint errors
- All tests passing
- Manual testing checklist completed
- Contacts persist across page reloads
- User can add contacts and use them in transfers

---

## 🚨 FINAL VERIFICATION BEFORE SUBMISSION

### **STOP! Before marking this plan as complete, verify EVERY item below:**

#### **File Organization Verification**

Run these checks in the terminal:

```bash
# Check for loose files (should return NOTHING)
find src/contexts/payments -maxdepth 3 -type f -name "*.ts" -o -name "*.tsx" | grep -v "/[^/]*/"

# Check for files not in folders at use-cases level
find src/contexts/payments/*/application/use-cases -maxdepth 1 -type f

# Check for files not in folders at entities level
find src/contexts/payments/*/domain/entities -maxdepth 1 -type f
```

**Expected result**: All commands should return EMPTY or only `index.ts` files.

---

#### **File Naming Verification**

```bash
# Check for wrong entity naming (should return NOTHING)
find src/contexts/payments -name "*Entity.ts" -o -name "*entity.tsx"

# Check for wrong use case naming (should return NOTHING)
find src/contexts/payments -name "*UseCase.ts" -o -name "*use-case.ts"

# Check for PascalCase component files (should return NOTHING)
find src/contexts/payments -name "*Page.tsx" -o -name "*Component.tsx"

# Check for wrong error naming (should return NOTHING)
find src/contexts/payments -name "*-error.ts" -o -name "*Error.ts"
```

**Expected result**: All commands should return EMPTY.

---

#### **Test Files Verification**

```bash
# Find implementation files without corresponding test files
for file in $(find src/contexts/payments -name "*.entity.ts" -o -name "*.useCase.ts" -o -name "*.service.ts" -o -name "*.repository.ts" | grep -v ".spec.ts"); do
  test_file="${file%.ts}.spec.ts"
  if [ ! -f "$test_file" ]; then
    echo "MISSING TEST: $file"
  fi
done
```

**Expected result**: Should return EMPTY (all files have tests).

---

#### **Path Aliases Verification**

```bash
# Check for relative imports (should return NOTHING)
grep -r "from ['\"]\.\./" src/contexts/payments --include="*.ts" --include="*.tsx"

# Check for relative imports with ./ (should return NOTHING except local imports)
grep -r "from ['\"]\./" src/contexts/payments --include="*.ts" --include="*.tsx" | grep -v "from './[^/]*'"
```

**Expected result**: Should return EMPTY (no relative imports to parent directories).

---

#### **Barrel Exports Verification**

```bash
# Check for wildcard exports (should return NOTHING)
grep -r "export \* from" src/contexts/payments --include="index.ts"
```

**Expected result**: Should return EMPTY (no `export *` statements).

---

#### **TypeScript Verification**

```bash
# Check for 'any' types (should return NOTHING or very few justified cases)
grep -r ": any" src/contexts/payments --include="*.ts" --include="*.tsx"

# Check for inline type assertions (should return NOTHING)
grep -r "as {" src/contexts/payments --include="*.ts" --include="*.tsx"
```

**Expected result**: Should return EMPTY or only justified cases.

---

#### **Chakra UI Verification**

```bash
# Check for hardcoded colors (should return NOTHING)
grep -r 'bg="#' src/contexts/payments --include="*.tsx"
grep -r 'color="#' src/contexts/payments --include="*.tsx"
grep -r 'backgroundColor:' src/contexts/payments --include="*.tsx"
```

**Expected result**: Should return EMPTY (no hardcoded colors).

---

#### **Code Quality Verification**

```bash
# Run TypeScript compiler
npm run type-check

# Run ESLint
npm run lint

# Run tests
npm test

# Run Prettier check
npm run format:check
```

**Expected result**: All commands should pass with 0 errors.

---

### **Manual Code Review Checklist**

Open each file you created/modified and verify:

#### **For EVERY .ts/.tsx file:**

- [ ] File is inside a folder (not at folder root)
- [ ] File name follows exact naming convention
- [ ] All imports use path aliases (no `../`)
- [ ] No `any` types
- [ ] No inline types (`as { ... }`)
- [ ] All functions have explicit return types
- [ ] Code in English, UI text in Spanish
- [ ] No unnecessary comments

#### **For EVERY implementation file:**

- [ ] Corresponding `.spec.ts` file exists next to it
- [ ] Test follows BDD structure (Given-When-Then)
- [ ] Test has meaningful assertions

#### **For EVERY component file:**

- [ ] Uses Chakra UI components
- [ ] Uses theme tokens (no hardcoded colors)
- [ ] Error handling with `useErrorHandler` or `useFormErrorHandler`
- [ ] All UI text in Spanish

#### **For EVERY barrel export (index.ts):**

- [ ] Uses explicit exports (no `export *`)
- [ ] Exports match actual file names

#### **For EVERY error mapper:**

- [ ] Implements `IErrorMapper` interface
- [ ] Has `toPresentation` method
- [ ] Has `toFormError` method
- [ ] All messages in Spanish

---

### **Architecture Compliance Checklist**

- [ ] Domain layer has NO UI dependencies
- [ ] Domain errors extend `DomainError`
- [ ] Domain errors have NO UI metadata
- [ ] Use cases let errors bubble up
- [ ] Each subdomain has clear boundaries
- [ ] No cross-subdomain imports (transfer ↔ contact)
- [ ] Path aliases updated in `tsconfig.json`
- [ ] All routes have `"use client"` directive

---

### **Functional Testing Checklist**

Test manually in browser:

- [ ] Can navigate to `/transactions/new`
- [ ] "Agregar nuevo contacto" button appears FIRST
- [ ] Can click button and navigate to add contact page
- [ ] Form displays with all fields
- [ ] Form validation works (Zod + Domain)
- [ ] Can submit form with valid data
- [ ] Contact saves to localStorage
- [ ] Redirects to transfer page with contact preselected
- [ ] Contact appears in contact list
- [ ] Reload page - contact still exists
- [ ] Favorites appear in "Favoritos" section
- [ ] Non-favorites appear in "Todos los contactos" section
- [ ] Can select contact and create transfer

---

### **localStorage Verification**

Open browser DevTools → Application → Local Storage:

- [ ] Key `mini-wallet:contacts` exists
- [ ] Value is valid JSON array
- [ ] Each contact has: `id`, `name`, `email`, `phone`, `isFavorite`
- [ ] Email and phone are primitive strings (not objects)
- [ ] Adding contact updates localStorage immediately
- [ ] Reloading page loads contacts from localStorage

---

## ⚠️ CRITICAL: If ANY verification fails, the implementation is INCOMPLETE

**DO NOT mark this plan as complete until:**

1. ✅ All automated checks pass (TypeScript, ESLint, tests)
2. ✅ All file organization checks pass
3. ✅ All naming convention checks pass
4. ✅ All manual code review items checked
5. ✅ All architecture compliance items checked
6. ✅ All functional tests pass
7. ✅ localStorage verification complete

**Incomplete implementation = Failed implementation. No exceptions.**
