# Architectural Decisions - Mini Wallet Web App

## Index

1. [Technology Stack](#technology-stack)
2. [General Architecture](#general-architecture)
3. [Folder Structure](#folder-structure)
4. [Domains (DDD)](#domains-ddd)
5. [Dependency Rules](#dependency-rules)
6. [Patterns and Conventions](#patterns-and-conventions)
7. [Testing](#testing)
8. [Tool Configuration](#tool-configuration)

---

## Technology Stack

### Framework and Language

- **Next.js** with **App Router** (`app/` folder)
- **TypeScript** with full strict mode enabled
- **React 18+**

**TypeScript Configuration**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Rules**:

- No `any` types allowed (use `unknown` with type guards if needed)
- No inline types (always define types/interfaces in separate files or at file top)
- All function parameters and return types must be explicitly typed

### Rendering Strategy

- Pure **CSR (Client-Side Rendering)** - NO Server-Side Rendering
- **Justification**: Authenticated application without public content, no SEO required. All content is dynamic and user-personalized. CSR simplifies the mental model, avoids hydration complexity, and allows optimization with code splitting and lazy loading.

**Implementation**:

- Add `"use client"` directive at the top of ALL Next.js route files (`app/*/page.tsx`)
- This forces client-only rendering (no SSR)
- Root `layout.tsx` should also have `"use client"`
- Domain components (`infrastructure/ui/pages/*`) do NOT need `"use client"` (they inherit from route)

**Example**:

```typescript
// app/(dashboard)/home/page.tsx
"use client"; // ← MANDATORY for CSR

import { HomePage } from "#wallet/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage />;
}
```

**Note**: Even though Next.js App Router defaults to Server Components, adding `"use client"` to route files ensures pure client-side rendering.

### Global State

- **Zustand** for global state management
- Store per domain when necessary

### UI and Styles

- **Chakra UI** as the component library (traditional library, not copy-paste)
- **Tailwind CSS** for custom styles when needed (classes only, no inline CSS)
- **PostCSS** configured to optimize and clean generated classes
- **Atomic Design** for component organization in infrastructure
- **Design Tokens** via Chakra UI theme system for centralized theming

**Design Tokens Configuration**:

- Colors: Primary, secondary, semantic (success, error, warning, info), neutral
- Spacing: Based on 4px grid system
- Typography: Font sizes with line heights, font families
- Border radius: Consistent rounding scale
- Shadows: Predefined shadow levels
- Z-index: Layering scale for overlays
- Transitions: Standard animation durations

**UI/UX Standards**:

- Modern, professional design inspired by fintech apps (Nubank, Revolut, N26)
- Always use Chakra UI components as foundation
- Proper spacing, visual hierarchy, and responsive design
- Interactive states (hover, focus, disabled, loading) built-in with Chakra
- Icons from lucide-react library
- Mobile-first approach
- Accessibility considerations built-in with Chakra UI (ARIA labels, keyboard navigation)

### Forms and Validation

- **React Hook Form** for form state management
- **Zod** for schema validation
- **Hybrid approach**: UI validation (Zod) + Business validation (Domain Value Objects)

### Notifications and Toasts

- **Sileo** for toast notifications
- Minimal, opinionated toast component with SVG morphing and spring physics
- Beautiful by default, no configuration required

### Testing

- **Vitest** with **React Testing Library** for unit and integration tests
- **Playwright** for E2E tests
- **BDD** (Given, When, Then) for test structure

### Code Quality

- **ESLint** with strict configuration
- **Prettier** for formatting
- **Husky** for pre-commit hooks
- **eslint-plugin-boundaries** to enforce DDD rules
- **eslint-plugin-perfectionist** for automatic sorting (imports, objects, exports, etc.)

---

## General Architecture

### Architectural Principles

1. **Domain-Driven Design (DDD)**: Separation by business domains
2. **Hexagonal Architecture**: Separation between domain, application, and infrastructure
3. **Screaming Architecture**: Folder structure screams business purpose
4. **Atomic Design**: For UI component organization in the infrastructure layer

### Hexagonal Architecture Layers

```
┌─────────────────────────────────────────────┐
│         INFRASTRUCTURE LAYER                │
│  (UI, API, Repositories, External Services) │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      APPLICATION LAYER                │ │
│  │    (Use Cases, Orchestration)         │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │      DOMAIN LAYER               │ │ │
│  │  │  (Entities, VOs, Services,      │ │ │
│  │  │   Business Rules)               │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Domain Layer (Core)

- **Entities**: Objects with identity and lifecycle
- **Value Objects (VO)**: Immutable objects without identity
- **Domain Services**: Business logic that doesn't belong to an entity
- **Errors**: Specific domain errors
- **No external dependencies**: Pure business logic only

#### Application Layer (Use Cases)

- **Use Cases**: Orchestration of business logic
- Can depend on: Domain Layer
- Cannot depend on: Infrastructure Layer

#### Infrastructure Layer (Adapters)

- **UI**: React components (Atomic Design), pages
- **Repositories**: Persistence implementations
- **API**: HTTP clients, API routes
- Can depend on: Domain and Application Layers

---

## Folder Structure

### Root Structure

```
/
├── .devin/
│   └── workflows/
├── .specs/
├── app/                    # Next.js App Router
├── e2e/                    # End-to-End Tests
├── public/
├── src/
│   ├── contexts/           # Domains (DDD)
│   └── shared/             # Shared code between domains
├── .eslintrc.json
├── .prettierrc
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Domain Structure (Context)

**Fundamental Rule**: Everything must be grouped in folders, never loose files in a folder root.

```
/src/contexts/{domain}/
├── application/
│   └── use-cases/
│       ├── {use-case-name}/
│       │   ├── {useCaseName}.useCase.ts
│       │   ├── {useCaseName}.interface.ts
│       │   └── {useCaseName}.useCase.spec.ts
│       └── index.ts        # Barrel export
├── domain/
│   ├── entities/
│   │   ├── {entity-name}/
│   │   │   ├── {entityName}.entity.ts
│   │   │   ├── {entityName}.interface.ts
│   │   │   └── {entityName}.entity.spec.ts
│   │   └── index.ts
│   ├── value-objects/
│   │   ├── {vo-name}/
│   │   │   ├── {vo-name}.vo.ts
│   │   │   └── {vo-name}.vo.spec.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── {service-name}/
│   │   │   ├── {service-name}.service.ts
│   │   │   └── {service-name}.service.spec.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── {error-name}/
│   │   │   └── {error-name}.error.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   ├── pages/
│   │   │   └── {page-name}/
│   │   │       ├── {page-name}.page.tsx
│   │   │       └── {page-name}.page.spec.tsx
│   │   ├── schemas/
│   │   │   └── {schema-name}.schema.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── {repository-name}/
│   │   │   ├── {repository-name}.repository.ts
│   │   │   ├── {repository-name}.repository.mock.ts
│   │   │   ├── {repository-name}.fixtures.ts
│   │   │   └── {repository-name}.repository.spec.ts
│   │   └── index.ts
│   ├── store/
│   │   └── {domain}.store.ts
│   ├── api/
│   │   ├── {api-name}/
│   │   │   └── {api-name}.api.ts
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

### E2E Test Structure

```
/e2e/
├── flows/
│   ├── login.spec.ts
│   ├── transaction-flow.spec.ts
│   └── home-navigation.spec.ts
├── fixtures/
│   ├── users.fixture.ts
│   ├── transactions.fixture.ts
│   └── contacts.fixture.ts
├── page-objects/
│   ├── login.page.ts
│   ├── home.page.ts
│   └── transaction.page.ts
└── playwright.config.ts
```

**Justification**: E2E tests test complete flows that span multiple domains. They don't belong to any specific domain, so they live at the project root.

**Fixtures**: Reusable test data (mock users, transactions, etc.) used across multiple tests.

**Page Objects**: Pattern to encapsulate page interaction logic, avoiding repeated selectors and actions in each test.

### Shared Folder

```
/src/shared/
├── ui/
│   ├── components/         # Custom shared UI components (atoms, molecules, etc.)
│   ├── hooks/              # Shared React hooks
│   └── utils/              # UI utilities
├── domain/
│   ├── value-objects/      # VOs shared between domains
│   ├── errors/             # Base DomainError and shared errors
│   └── interfaces/         # Interfaces shared between domains
├── infrastructure/
│   ├── store/              # ONLY cross-domain stores (theme, notifications, etc.)
│   ├── http/               # Base HTTP client
│   ├── config/             # Mock configuration (delays, error rates)
│   └── utils/
└── index.ts
```

**IMPORTANT**: Domain-specific stores (auth, wallet, transactions) should NOT be in `/src/shared/infrastructure/store/`. They belong in each domain's infrastructure layer.

---

## Domains (DDD)

### Identified Domains

#### 1. `auth` (Identity & Access)

**Responsibility**: Authentication and session management

**Entities**:

- `User` (authenticated user)

**Value Objects**:

- `Email`
- `Phone`

**Use Cases**:

- `LoginUseCase`
- `LogoutUseCase`
- `ValidateSessionUseCase`

**Business Rules**:

- Email/phone format validation
- Mocked session persistence
- Authentication state management

---

#### 2. `wallet` (Core Domain)

**Responsibility**: Balance and user profile management

**Entities**:

- `Balance` (available balance)
- `UserProfile` (name, basic info)

**Value Objects**:

- `Amount` (amount with validations)

**Use Cases**:

- `GetBalanceUseCase`
- `GetUserProfileUseCase`

**Business Rules**:

- Balance always >= 0
- Amount formatting (decimals, currency)

---

#### 3. `transactions` (Transactions)

**Responsibility**: Creation, validation, and listing of transactions

**Entities**:

- `Transaction` (transaction with state)
- `Contact` (recipient/contact)

**Value Objects**:

- `Amount` (shared with wallet)
- `TransactionStatus` (pending, success, failed)

**Domain Services**:

- `TransactionValidationService` (business validations)

**Use Cases**:

- `CreateTransactionUseCase`
- `ConfirmTransactionUseCase`
- `GetTransactionsUseCase`
- `AddContactUseCase`
- `GetContactsUseCase`

**Business Rules**:

- Minimum amount > 0
- Sufficient balance (query to wallet)
- Recipient mandatory
- Transaction states (success, error, timeout)

---

### Relationship Between Domains

```
┌──────────┐
│   auth   │
└────┬─────┘
     │ provides session
     ▼
┌──────────┐      queries balance      ┌──────────────┐
│  wallet  │◄────────────────────────│ transactions │
└──────────┘                          └──────────────┘
```

**Note**: `transactions` can query `wallet` to validate balance, but should not have a direct dependency. An interface or event should be used.

---

## Dependency Rules

### Layer Rules (Hexagonal)

1. **Domain** cannot import from **Application** or **Infrastructure**
2. **Application** can import from **Domain**, but NOT from **Infrastructure**
3. **Infrastructure** can import from **Domain** and **Application**

### Domain Rules (DDD)

4. A domain **CANNOT** directly import from another domain
5. If communication between domains is needed, use:
   - Interfaces in `shared/domain`
   - Domain events
   - Dependency injection in Application Layer

### Enforcement with ESLint

**`eslint-plugin-boundaries`** should be used to enforce these rules automatically.

**Expected Configuration**:

- Define boundaries by layer (domain, application, infrastructure)
- Define boundaries by domain (auth, wallet, transactions)
- Configure allowed dependency rules
- Fail lint if any rule is violated

**Violation Example**:

```typescript
// ❌ INCORRECT - Domain importing from Infrastructure
// src/contexts/auth/domain/entities/user/user.entity.ts
import { api } from "#auth/infrastructure/api"; // ❌ Violation

// ❌ INCORRECT - One domain importing from another
// src/contexts/transactions/domain/services/validation.service.ts
import { Balance } from "#wallet/domain/entities"; // ❌ Violation

// ✅ CORRECT - Use shared or interfaces
import { BalanceProvider } from "#shared/domain/interfaces";
```

---

## Patterns and Conventions

### Naming Conventions

#### Files

- **Entities**: `{name}.entity.ts`
- **Value Objects**: `{name}.vo.ts`
- **Services**: `{name}.service.ts`
- **Use Cases**: `{name}.useCase.ts` (camelCase)
- **Repositories**: `{name}.repository.ts`
- **Components**: `{name}.tsx`
- **Tests**: `{name}.spec.ts` or `{name}.spec.tsx`
- **Interfaces**: `{name}.interface.ts`

#### Folders

- **kebab-case**: `transaction-validation/`
- Always grouped, never loose files in root

#### Barrels (index.ts)

**MANDATORY RULE**: Use explicit individual exports, NOT `export *`.

- Each subfolder must have its barrel at the root
- Barrels provide controlled public API for each module
- Allows clean imports: `import { User } from "#auth/domain/entities"`

**Correct Implementation**:

```typescript
// ✅ CORRECT - Explicit exports
// src/contexts/auth/domain/entities/index.ts
export { User } from "./user/user.entity";
export type { User as IUser } from "./user/user.interface";

// ❌ INCORRECT - Wildcard exports
export * from "./user/user.entity"; // Don't use this
```

**Reasons**:

- Full control over public API
- Prevents accidental exports of internal helpers
- Avoids name conflicts between files
- Better for tree-shaking and refactoring
- Explicit is better than implicit

### Import Aliases

**MANDATORY RULE**: Always use path aliases for imports. **NEVER** use relative paths (e.g., `../../../`). This ensures consistency, readability, and makes refactoring easier.

**`tsconfig.json` Configuration**:

```json
{
  "compilerOptions": {
    "paths": {
      "#auth/*": ["src/contexts/auth/*"],
      "#wallet/*": ["src/contexts/wallet/*"],
      "#transactions/*": ["src/contexts/transactions/*"],
      "#shared/*": ["src/shared/*"],
      "@/app/*": ["app/*"]
    }
  }
}
```

**Usage**:

```typescript
// ✅ CORRECT - Using aliases
import { LoginUseCase } from "#auth/application/use-cases";
import { Amount } from "#shared/domain/value-objects";
import { Button } from "#shared/infrastructure/ui/components";

// ❌ INCORRECT - Using relative paths
import { LoginUseCase } from "../../../application/use-cases";
import { Amount } from "../../../../shared/domain/value-objects";
```

### Code Style

- **Double quotes** always: `"string"`
- **Indentation**: 2 spaces
- **Newline at the end** of each file
- **No `any`**: Use `unknown` if necessary, then type guard
- **No inline types**: Always define types/interfaces in separate files or at the start of the file
- **Tailwind classes**: Tailwind classes only, no inline CSS (`style={{}}`)

### Mandatory Use of Interfaces

**Fundamental Rule**: All entities, use cases, services, and repositories **MUST** have an interface.

**Reasons**:

1. **Dependency Inversion**: Allows injecting mock implementations in tests
2. **Clear Contracts**: Explicitly defines expected behavior
3. **Flexibility**: Makes it easier to change implementations without affecting consumers
4. **Testing**: Allows easy mock creation

**Mandatory Structure**:

```
/entity-name/
  entityName.interface.ts    ← Interface (contract)
  entityName.entity.ts       ← Implementation
  entityName.entity.spec.ts  ← Tests
```

**Naming convention**:

- Interfaces: `{name}.interface.ts` (no `I` prefix)
- Always in separate files with `.interface.ts` for clarity

### Value Objects (VO)

**Characteristics**:

- Immutable
- No identity (equality by value)
- Validations in constructor
- Business methods if applicable

**Structural Example**:

```typescript
// src/contexts/wallet/domain/value-objects/amount/amount.interface.ts
export interface Amount {
  getValue(): number;
  isGreaterThan(other: Amount): boolean;
  add(other: Amount): Amount;
}

// src/contexts/wallet/domain/value-objects/amount/amount.vo.ts
import { Amount as AmountInterface } from "./amount.interface";

export class Amount implements AmountInterface {
  private constructor(private readonly value: number) {
    // Validations in constructor
  }

  static create(value: number): Amount {
    // Factory method with validations
  }

  getValue(): number {
    return this.value;
  }

  // Business methods
  isGreaterThan(other: AmountInterface): boolean {}
  add(other: AmountInterface): Amount {}
}
```

### Entities

**Characteristics**:

- Have identity (ID)
- Can mutate (but controlled)
- Encapsulate business logic

**Structural Example**:

```typescript
// src/contexts/transactions/domain/entities/transaction/transaction.interface.ts
export interface Transaction {
  getId(): string;
  getStatus(): TransactionStatus;
  confirm(): void;
  fail(reason: string): void;
}

// src/contexts/transactions/domain/entities/transaction/transaction.entity.ts
import { Transaction as TransactionInterface } from "./transaction.interface";

export class Transaction implements TransactionInterface {
  private constructor(
    private readonly id: string,
    private status: TransactionStatus
    // ...
  ) {}

  static create(params: CreateTransactionParams): Transaction {}

  getId(): string {
    return this.id;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  confirm(): void {
    // Business logic to confirm
  }

  fail(reason: string): void {
    // Business logic to fail
  }
}
```

### Domain Services

**When to use**:

- Business logic involving multiple entities
- Complex validations that don't belong to a specific entity

**Structural Example**:

```typescript
// src/contexts/transactions/domain/services/transaction-validation/transaction-validation.service.ts
export class TransactionValidationService {
  validateTransaction(
    transaction: Transaction,
    balance: Balance
  ): ValidationResult {
    // Complex validation logic
  }
}
```

### Use Cases

**Characteristics**:

- Orchestrate business logic
- One use case = one user action
- Can depend on repositories (injected)

**Structural Example**:

```typescript
// src/contexts/transactions/application/use-cases/create-transaction/createTransaction.interface.ts
export interface CreateTransactionUseCase {
  execute(params: CreateTransactionParams): Promise<Transaction>;
}

// src/contexts/transactions/application/use-cases/create-transaction/createTransaction.useCase.ts
import { CreateTransactionUseCase as CreateTransactionUseCaseInterface } from "./createTransaction.interface";

export class CreateTransactionUseCase implements CreateTransactionUseCaseInterface {
  constructor(
    private transactionRepository: TransactionRepository,
    private balanceRepository: BalanceRepository
  ) {}

  async execute(params: CreateTransactionParams): Promise<Transaction> {
    // 1. Validate
    // 2. Create entity
    // 3. Persist
    // 4. Return
  }
}
```

### Repositories

**Characteristics**:

- Interface in Domain or Application
- Implementation in Infrastructure
- Mock for testing

**Structural Example**:

```typescript
// src/contexts/transactions/domain/repositories/transaction.repository.interface.ts
export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
}

// src/contexts/transactions/infrastructure/repositories/transaction-repository/transaction.repository.ts
import { TransactionRepository as TransactionRepositoryInterface } from "#transactions/domain/repositories";

export class TransactionRepository implements TransactionRepositoryInterface {
  // Real implementation (mock in this case)
}

// src/contexts/transactions/infrastructure/repositories/transaction-repository/transaction.repository.mock.ts
import { TransactionRepository as TransactionRepositoryInterface } from "#transactions/domain/repositories";

export class TransactionRepositoryMock implements TransactionRepositoryInterface {
  // Implementation for tests
}
```

---

## Testing

### Testing Strategy

1. **Unit Tests**: Domain (entities, VOs, services) and Application (use cases)
2. **Integration Tests**: Infrastructure (repositories, API clients)
3. **Component Tests**: UI components
4. **E2E Tests**: Complete user flows

### Test Location

**Fundamental Rule**: Tests must be **next to** the file they test, **NOT** in a `__tests__` folder.

```
/use-cases/
  /create-transaction/
    createTransaction.useCase.ts
    createTransaction.interface.ts
    createTransaction.useCase.spec.ts    ← Next to the file
```

### Test Structure (BDD)

All tests must follow the **Given-When-Then** pattern with nested `describe`:

```typescript
describe("CreateTransactionUseCase", () => {
  describe("Given a user with sufficient balance", () => {
    describe("When creating a transaction", () => {
      it("Then should create transaction successfully", () => {
        const balance = Balance.create(1000);
        const params = { amount: 500, recipient: "..." };

        const result = useCase.execute(params);

        expect(result.isSuccess()).toBe(true);
      });
    });
  });

  describe("Given a user with insufficient balance", () => {
    describe("When creating a transaction", () => {
      it("Then should fail with InsufficientFundsError", () => {
        const balance = Balance.create(100);
        const params = { amount: 500, recipient: "..." };

        const result = useCase.execute(params);

        expect(result.isFailure()).toBe(true);
        expect(result.error).toBeInstanceOf(InsufficientFundsError);
      });
    });
  });
});
```

**Mandatory Structure**:

- **First level**: `describe("SUTName")` (System Under Test)
- **Second level**: `describe("Given [context/precondition]")`
- **Third level**: `describe("When [action]")`
- **Fourth level**: `it("Then [expected result]")`

This structure applies to **unit, integration, and E2E tests**.

### Testing with Vitest

- Use `describe` to group tests
- Use `it` or `test` for individual cases
- Use `beforeEach` for common setup
- Mocks with `vi.fn()` and `vi.mock()`

### Component Testing

```typescript
// src/contexts/auth/infrastructure/ui/pages/login-page/login-page.spec.tsx
describe("LoginPage", () => {
  it("should render login form", () => {
    // Given
    render(<LoginPage />);

    // Then
    expect(screen.getByLabelText("Phone or Email")).toBeInTheDocument();
  });

  it("should call login use case when form is submitted", async () => {
    // Given
    const mockLogin = vi.fn();
    render(<LoginPage onLogin={mockLogin} />);

    // When
    await userEvent.type(screen.getByLabelText("Phone or Email"), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then
    expect(mockLogin).toHaveBeenCalledWith("test@example.com");
  });
});
```

### E2E Testing with Playwright

**Fixtures**: Reusable test data

```typescript
// e2e/fixtures/users.fixture.ts
export const testUser = {
  phone: "+521234567890",
  name: "Juan Pérez",
  balance: 5000,
};
```

**Page Objects**: Encapsulate page interactions

```typescript
// e2e/page-objects/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(phone: string) {
    await this.page.fill('[data-testid="phone-input"]', phone);
    await this.page.click('[data-testid="login-button"]');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL("/home");
  }
}
```

**E2E Flows**:

```typescript
// e2e/flows/transactionFlow.spec.ts
test.describe("Transaction Flow", () => {
  test.describe("Given an authenticated user with sufficient balance", () => {
    test.describe("When completing a transaction", () => {
      test("Then should show success confirmation", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testUser.phone);

        const homePage = new HomePage(page);
        await homePage.clickNewTransaction();

        const transactionPage = new TransactionPage(page);
        await transactionPage.fillAmount(100);
        await transactionPage.selectContact("María García");
        await transactionPage.confirm();

        await expect(page.getByText("Transaction successful")).toBeVisible();
      });
    });
  });
});
```

---

## Tool Configuration

### Husky Pre-commit Hooks (v9)

Every commit must verify:

1. **Lint**: `eslint` on modified files
2. **Format**: `prettier` on modified files
3. **Tests**: Unit tests for modified files

**Installation**:

```bash
npx husky init
npm install --save-dev lint-staged
```

**Configuration**:

`.husky/pre-commit`:

```bash
npm run lint-staged
```

`package.json`:

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "vitest related --run"]
  }
}
```

### ESLint

**Required Plugins**:

- `@typescript-eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-boundaries` (to enforce DDD)
- `eslint-plugin-perfectionist` (automatic sorting)

**Important Rules**:

- No `any`
- No `console.log` in production
- Automatic sorting of imports, objects, exports, JSX props (perfectionist)
- DDD Boundaries enforcement

**Perfectionist Configuration**:

- Uses `recommended-natural` preset
- Automatically sorts:
  - Imports (alphabetically with natural sorting)
  - Named imports/exports
  - Object properties
  - JSX props
  - Module exports
- Fixable with `--fix` flag

### Prettier

**Configuration**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

### PostCSS and Tailwind

**PostCSS** must be configured to:

- Purge unused classes in production
- Optimize the CSS bundle
- Minify

**Tailwind** configured with:

- Paths to all files using classes
- Custom theme if necessary
- shadcn/ui plugins

---

## Navigation Flow (App Router)

### App Router Location in Architecture

**Important**: The Next.js `/app` folder is part of the **infrastructure layer**, NOT the domain.

```
┌─────────────────────────────────────────────┐
│         INFRASTRUCTURE LAYER                │
│                                             │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │  /app       │─────▶│  /src/contexts  │  │
│  │  (Next.js   │      │  (Domain logic) │  │
│  │   Routes)   │      │                 │  │
│  └─────────────┘      └─────────────────┘  │
└─────────────────────────────────────────────┘
```

**Principle**: Next.js pages are **adapters** that:

1. Receive HTTP requests
2. Invoke domain use cases
3. Return responses (HTML, JSON)

**Clear Separation**:

- `/app`: Next.js routes and adapters (infrastructure)
- `/src/contexts`: Business logic (domain + application)
- `/src/contexts/{domain}/infrastructure/ui`: Presentation components

### Route Structure

```
/app/
├── (auth)/
│   └── login/
│       └── page.tsx           → /login
├── (dashboard)/
│   ├── home/
│   │   └── page.tsx           → /home
│   └── transactions/
│       ├── new/
│       │   └── page.tsx       → /transactions/new
│       └── confirm/
│           └── page.tsx       → /transactions/confirm
├── layout.tsx
└── page.tsx                   → / (redirect to /login or /home)
```

**Route Groups** `(auth)` and `(dashboard)`:

- Allow different layouts without affecting the URL
- `(auth)`: No navbar, centered
- `(dashboard)`: With navbar, sidebar if applicable

### Pages and Components

**Pages** (`app/*/page.tsx`):

- These are Next.js components
- Should be thin, orchestration only
- Import components from `infrastructure/ui/pages`

**Page Components** (`infrastructure/ui/pages`):

- Contain presentation logic
- Use use case hooks
- Compose atomic components

**Separation Example**:

```typescript
// app/(dashboard)/home/page.tsx (INFRASTRUCTURE - Next.js Adapter)
import { HomePage } from "#wallet/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage />;
}

// src/contexts/wallet/infrastructure/ui/pages/home-page/homePage.tsx (INFRASTRUCTURE - UI)
export function HomePage() {
  // Presentation logic, hooks, etc.
  // Invokes domain use cases
}

// src/contexts/wallet/application/use-cases/get-balance/getBalance.useCase.ts (APPLICATION)
import { GetBalanceUseCase as GetBalanceUseCaseInterface } from "./getBalance.interface";

export class GetBalanceUseCase implements GetBalanceUseCaseInterface {
  // Business logic
}
```

**Data Flow**:

1. User accesses `/home` → Next.js routes to `app/(dashboard)/home/page.tsx`
2. `page.tsx` renders domain `<HomePage />`
3. `<HomePage />` uses hooks that invoke use cases
4. Use cases execute business logic and return data
5. Component renders UI with the data

---

## State Management with Zustand

### Stores per Domain

**IMPORTANT**: Each domain's store **MUST** be located inside its own domain's infrastructure layer, NOT in shared.

```
/src/contexts/auth/infrastructure/store/
  auth.store.ts
/src/contexts/wallet/infrastructure/store/
  wallet.store.ts
/src/contexts/transactions/infrastructure/store/
  transactions.store.ts
```

**Exception**: Only stores that are truly cross-domain (e.g., theme, notifications, global UI state) should go in `/src/shared/infrastructure/store/`.

### Principles

- **Minimal**: Only state that really needs to be global
- **Derived**: Use selectors for derived state
- **Actions**: Methods in the store to mutate state
- **Persistence**: Use Zustand middleware for localStorage if applicable
- **Domain Isolation**: Each domain's store lives in its own infrastructure layer

**Structural Example**:

```typescript
// src/contexts/auth/infrastructure/store/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## Forms and Validation

### Hybrid Validation Strategy

The application uses a **two-layer validation approach**:

1. **UI Layer Validation** (React Hook Form + Zod)
2. **Domain Layer Validation** (Value Objects)

### UI Layer Validation (Infrastructure)

**Purpose**: Immediate user feedback for format, required fields, and basic constraints.

**Tools**:

- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation with TypeScript inference
- **@hookform/resolvers/zod**: Integration between RHF and Zod

**Location**: `src/contexts/{domain}/infrastructure/ui/schemas/`

**Example**:

```typescript
// src/contexts/auth/infrastructure/ui/schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Este campo es requerido")
    .max(100, "Máximo 100 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**Usage in Component**:

```typescript
// src/contexts/auth/infrastructure/ui/pages/login-page/login-page.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../schemas/login.schema";

export function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change
  });

  const onSubmit = async (data: LoginFormData) => {
    // Domain validation happens here
    const result = await loginUseCase.execute(data);

    if (result.isFailure()) {
      form.setError("emailOrPhone", {
        message: result.error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="emailOrPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email o Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Iniciar sesión</Button>
      </form>
    </Form>
  );
}
```

### Domain Layer Validation (Domain)

**Purpose**: Business rules and complex validations.

**Location**: Value Objects in `src/contexts/{domain}/domain/value-objects/`

**Example**:

```typescript
// src/contexts/auth/domain/value-objects/email/email.vo.ts
import { DomainError } from "#shared/domain/errors";

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Result<Email, DomainError> {
    // Business validation
    if (!this.isValidFormat(value)) {
      return Result.fail(new InvalidEmailError(value));
    }

    if (this.isBlacklisted(value)) {
      return Result.fail(new BlacklistedEmailError(value));
    }

    return Result.ok(new Email(value));
  }

  private static isValidFormat(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private static isBlacklisted(value: string): boolean {
    // Business rule: check against blacklist
    return false;
  }

  getValue(): string {
    return this.value;
  }
}
```

### Validation Flow

```
User Input
    ↓
[Zod Schema] ← UI validation (format, required, length)
    ↓
[React Hook Form] ← Manages form state
    ↓
[onSubmit]
    ↓
[Value Object.create()] ← Domain validation (business rules)
    ↓
[Use Case] ← Executes business logic
```

### When to Use Each Layer

| Validation Type        | Layer  | Tool              | Example                   |
| ---------------------- | ------ | ----------------- | ------------------------- |
| Required fields        | UI     | Zod               | `.min(1, "Required")`     |
| Format (email, phone)  | UI     | Zod               | `.email()` or regex       |
| Length constraints     | UI     | Zod               | `.min(3).max(50)`         |
| Business rules         | Domain | Value Objects     | Blacklist check           |
| Cross-field validation | Domain | Domain Services   | Amount <= Balance         |
| Complex logic          | Domain | Entities/Services | Transaction state machine |

### Benefits of Hybrid Approach

1. **Better UX**: Immediate feedback with Zod (no server round-trip)
2. **DDD Compliance**: Business logic stays in domain
3. **Type Safety**: Zod infers TypeScript types
4. **Performance**: React Hook Form minimizes re-renders
5. **Separation of Concerns**: UI validation ≠ Business validation
6. **Testability**: Each layer can be tested independently

---

## Error Handling

### Domain Errors

All domain errors must extend a base `DomainError` class:

```typescript
// src/shared/domain/errors/domainError.ts
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

Each domain defines its own errors by extending `DomainError`:

```typescript
// src/contexts/transactions/domain/errors/insufficient-funds/insufficientFunds.error.ts
import { DomainError } from "#shared/domain/errors";

export class InsufficientFundsError extends DomainError {
  constructor(
    public readonly required: number,
    public readonly available: number
  ) {
    super(
      `Insufficient funds: required ${required}, available ${available}`,
      "INSUFFICIENT_FUNDS"
    );
  }
}
```

### Use Case Handling

Use cases should return a `Result<T, E>` or throw domain errors:

```typescript
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
```

### UI Handling

**Error Display Strategy**:

1. **Validation errors**: Inline in forms (React Hook Form)
2. **Business errors**: Toast notifications (Sileo)
3. **Network errors**: Toast with retry action (Sileo)
4. **Loading states**: Promise toasts (Sileo)

---

## Business Rules (Transactions)

### Mandatory Validations

1. **Minimum Amount**: Zero or negative amounts are not allowed
2. **Sufficient Balance**: Amount cannot exceed available balance
3. **Recipient Mandatory**: Cannot confirm without a recipient

### Implementation

These validations must be in:

- **Domain Layer**: `TransactionValidationService` or in the `Transaction` entity
- **NOT** just in the UI (UI can validate for UX, but it's not the only validation)

### Confirmation Scenarios

Confirmation must handle randomly:

- ✅ **Success**: Transaction confirmed
- ❌ **Network Error**: Show error with retry option
- ❌ **Insufficient Funds**: Descriptive error
- ⏱️ **Timeout**: Handle excessive wait
- ❓ **Unknown Error**: Generic fallback

**Implementation**: Mock in repository that randomly returns these states.

---

## Mocked Data

### Mocking Strategy

- **Repositories**: Mock implementations with in-memory data
- **Delays**: Simulate network latency with configurable delays
- **Errors**: Return errors randomly based on configurable percentages
- **Fixtures**: Each domain has its own fixture files (DDD isolation)

### Fixture Structure (DDD Compliant)

**Per Domain** (respects boundaries):

```
/src/contexts/{domain}/infrastructure/repositories/{repository-name}/
  {repository-name}.repository.ts
  {repository-name}.repository.mock.ts
  {repository-name}.fixtures.ts  ← Mock data here
```

**Example**:

```
/src/contexts/auth/infrastructure/repositories/auth-repository/
  auth.fixtures.ts  ← Users mock data

/src/contexts/wallet/infrastructure/repositories/wallet-repository/
  wallet.fixtures.ts  ← Balance mock data

/src/contexts/transactions/infrastructure/repositories/transaction-repository/
  transaction.fixtures.ts  ← Transactions mock data
```

### Mock Configuration (Shared Infrastructure)

Technical configuration for delays and error rates:

```
/src/shared/infrastructure/config/
  mock.config.ts  ← Delays, error percentages
```

**Configuration includes**:

- Network delay ranges (min/max ms)
- Error rate percentages per operation
- Easily modifiable for testing different scenarios

### Initial Data

**Mocked User**:

- Name: "Juan Pérez"
- Phone: "+521234567890"
- Email: "juan.perez@example.com"
- Initial Balance: $5,000 MXN

**Mocked Transactions**:

- 5-10 historical transactions
- Mix of sent and received
- Different amounts and dates

**Mocked Contacts**:

- 3-5 favorite contacts
- Names, phones/emails

---

## Scalability Considerations

Although it's a mocked app, design decisions consider:

1. **Separation of Concerns**: Makes it easy to add new domains (investments, loans, etc.)
2. **Clear Boundaries**: Allows teams to scale (one team per domain)
3. **Robust Testing**: Confidence to refactor and add features
4. **Code Splitting**: Automatic Next.js per route, manual lazy loading if needed
5. **Optimistic UI**: Update UI before server confirmation (for better UX)

---

## Known Limitations

1. **No Real Backend**: All data is mocked in memory
2. **No Persistence**: Refreshing the page loses state (unless localStorage is used)
3. **No Real Authentication**: No JWT, OAuth, or real security
4. **No Concurrency Handling**: Race conditions in transactions are not considered
5. **No Internationalization**: English translation only

---

## Summary of Key Decisions

| Aspect              | Decision                  | Justification                                       |
| ------------------- | ------------------------- | --------------------------------------------------- |
| **Rendering**       | CSR                       | Authenticated app, no SEO, dynamic content          |
| **Navigation**      | App Router                | Modern Next.js standard                             |
| **State**           | Zustand                   | Simple, performant, no boilerplate                  |
| **E2E Testing**     | Playwright                | More modern and faster than Cypress                 |
| **Architecture**    | DDD + Hexagonal           | Scalability, maintainability, clear boundaries      |
| **UI**              | Atomic Design             | Reuse, consistency, scalability                     |
| **Components**      | shadcn/ui                 | Quality components, customizable, no vendor lock-in |
| **Styles**          | Tailwind CSS              | Productivity, consistency, small bundle             |
| **Quality**         | ESLint + Prettier + Husky | Consistent code, early errors                       |
| **DDD Enforcement** | eslint-plugin-boundaries  | Automatically enforce architectural rules           |

---

**Living Document**: This file should be updated as the project evolves and new architectural decisions are made.
