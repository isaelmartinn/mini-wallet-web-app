# AI Instructions

## Critical Prerequisites

**BEFORE starting ANY development work**, you **MUST**:

1. Read and fully understand the `DECISIONS.md` file at the root of this project
2. This file contains all architectural decisions, patterns, and conventions
3. **DO NOT proceed** without comprehending the content of `DECISIONS.md`

## Documentation Restrictions

- **DO NOT generate any `.md` documents after completing implementation plans**
- Focus solely on code implementation
- The existing documentation is sufficient

## Implementation Guidelines

### Shared Folder Structure

The `src/shared/` folder is organized by purpose to avoid confusion:

- **`src/shared/design-tokens/`** - Pure design configuration (theme, CSS utilities)
  - `theme/` - Chakra UI theme configuration (colors, fonts, tokens)
  - `utils/` - CSS utility functions (e.g., `cn()` for class merging)
  - **NO React dependencies** - Pure configuration only

- **`src/shared/infrastructure/ui/`** - React-specific UI infrastructure
  - `hooks/` - Custom React hooks (`useErrorHandler`, `useThemeToken`, etc.)
  - `components/` - Shared React components
  - `error-mapper/` - Error mapping system (domain → UI)
  - **React-dependent** - Hooks, components, state management

**Key distinction:**

- `design-tokens/` = Configuration (what)
- `infrastructure/ui/` = Implementation (how)

### Chakra UI Components

- **Use Chakra UI** as the component library
- Import components directly from `@chakra-ui/react`
- When you need a UI component:
  1. Check if it exists in Chakra UI library first
  2. Import and use it directly: `import { Button, Input } from "@chakra-ui/react"`
  3. Only create custom components if the functionality doesn't exist in Chakra UI or is very business-specific
- Chakra UI provides a complete set of accessible, composable components
- No need to copy/paste code - it's a traditional component library

### Zustand Store Location

- **Domain-specific stores** MUST be located in each domain's infrastructure layer:
  - ✅ `src/contexts/auth/infrastructure/store/auth.store.ts`
  - ✅ `src/contexts/wallet/infrastructure/store/wallet.store.ts`
  - ❌ NOT in `src/shared/infrastructure/store/`
- **Cross-domain stores** (theme, notifications, global UI state) go in:
  - ✅ `src/shared/infrastructure/store/`
- **Rule**: If a store is specific to ONE domain, it belongs in that domain's infrastructure

### Barrel Exports (index.ts)

- **ALWAYS use explicit individual exports**, NEVER use `export *`
- Example:

  ```typescript
  // ✅ CORRECT
  export { User } from "./user/user.entity";
  export type { User as IUser } from "./user/user.interface";

  // ❌ INCORRECT
  export * from "./user/user.entity";
  ```

- Reason: Better control, avoids name conflicts, prevents accidental exports

### CSR (Client-Side Rendering) Implementation

- **ALWAYS add `"use client"` at the top of ALL Next.js route files** (`app/*/page.tsx`)
- **ALWAYS add `"use client"` in root `app/layout.tsx`**
- Domain components (`src/contexts/*/infrastructure/ui/pages/*`) do NOT need `"use client"` (they inherit)
- This ensures pure CSR with NO server-side rendering

**Example**:

```typescript
// app/(dashboard)/home/page.tsx
"use client"; // ← MANDATORY

import { HomePage } from "#wallet/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage />;
}
```

### Error Handling and Notifications (Sileo)

- **Use Sileo for all toast notifications** (errors, success, loading)
- **Setup**: Add `<Toaster position="top-right" theme="dark" />` in root `app/layout.tsx`
- **Usage**:

  ```typescript
  import { sileo } from "sileo";

  // Error
  sileo.error({ title: "Error", description: "Mensaje" });

  // Success
  sileo.success({ title: "Éxito", description: "Mensaje" });

  // Promise (loading → success/error)
  sileo.promise(asyncFunction(), {
    loading: { title: "Procesando..." },
    success: { title: "Completado" },
    error: { title: "Error" },
  });
  ```

**When to use**:

- ✅ Business errors (insufficient funds, validation)
- ✅ Network errors
- ✅ Success confirmations
- ✅ Loading states for async operations
- ❌ NOT for form validation errors (use inline form errors instead)

### Forms and Validation (Hybrid Approach)

Use **two-layer validation**:

1. **UI Layer (React Hook Form + Zod)** - For immediate user feedback:
   - Location: `src/contexts/{domain}/infrastructure/ui/schemas/`
   - Validates: format, required fields, length, basic constraints
   - Tools: `react-hook-form`, `zod`, `@hookform/resolvers/zod`
   - Example:

     ```typescript
     const schema = z.object({
       email: z.string().min(1, "Required").email("Invalid email"),
     });

     const form = useForm({
       resolver: zodResolver(schema),
       mode: "onChange",
     });
     ```

2. **Domain Layer (Value Objects)** - For business rules:
   - Location: `src/contexts/{domain}/domain/value-objects/`
   - Validates: business rules, complex logic, cross-field validation
   - Called in `onSubmit` after Zod validation passes
   - Example:
     ```typescript
     const result = Email.create(data.email);
     if (result.isFailure()) {
       form.setError("email", { message: result.error.message });
     }
     ```

**When to use each**:

- Zod: Format, required, length, simple regex
- Value Objects: Blacklists, business rules, domain logic

### Husky v9 Pre-commit Hooks

- **Use Husky v9** for pre-commit hooks
- **Installation**: `npx husky init`
- **Configuration**:
  - `.husky/pre-commit` file should run: `npm run lint-staged`
  - `package.json` should have `lint-staged` configuration
  - Runs on staged files: ESLint, Prettier, Vitest related tests
- **DO NOT use old Husky v4 syntax** (no `"husky": { "hooks": {} }` in package.json)

### Mocked Data and Fixtures

- **Fixtures per domain** (respects DDD boundaries):
  - Location: `src/contexts/{domain}/infrastructure/repositories/{repository-name}/{repository-name}.fixtures.ts`
  - Each domain has its own mock data
  - Example: `auth.fixtures.ts`, `wallet.fixtures.ts`, `transaction.fixtures.ts`

- **Mock configuration** (shared infrastructure):
  - Location: `src/shared/infrastructure/config/mock.config.ts`
  - Contains: delay ranges, error rate percentages
  - Example:
    ```typescript
    export const MOCK_CONFIG = {
      delays: { min: 500, max: 1500 },
      errorRates: {
        transactions: {
          SUCCESS: 0.6,
          NETWORK_ERROR: 0.15,
          INSUFFICIENT_FUNDS: 0.1,
          TIMEOUT: 0.1,
          UNKNOWN_ERROR: 0.05,
        },
      },
    };
    ```

- **Usage in mock repositories**:
  - Import fixtures from same folder
  - Import config from shared
  - Simulate delays with `setTimeout`
  - Return errors based on configured percentages

### TypeScript Strict Mode

- **Full strict mode enabled** with additional safety flags
- **Required flags in tsconfig.json**:
  - `"strict": true`
  - `"noUncheckedIndexedAccess": true`
  - `"noImplicitOverride": true`
  - `"noUnusedLocals": true`
  - `"noUnusedParameters": true`
  - `"noFallthroughCasesInSwitch": true`

**Rules**:

- ❌ **NEVER use `any`** - Use `unknown` with type guards instead
- ❌ **ABSOLUTELY FORBIDDEN: NO inline types** - NEVER use inline object types with `as { ... }`
  - Always define interfaces or types at the top of the file or in separate `.interface.ts` files
  - Example of FORBIDDEN code:
    ```typescript
    // ❌ FORBIDDEN - Inline type assertion
    const data = JSON.parse(str) as { id: string; name: string };
    ```
  - Example of CORRECT code:
    ```typescript
    // ✅ CORRECT - Interface defined at file top or in separate file
    interface UserData {
      id: string;
      name: string;
    }
    const data = JSON.parse(str) as UserData;
    ```
- ✅ **Explicit typing** - All function parameters and return types must be typed
- ✅ **Type safety** - Leverage TypeScript's type system fully

### Design Tokens (Tailwind CSS)

- **ALWAYS use design tokens** from `tailwind.config.ts` instead of arbitrary values
- **Location**: All tokens defined in `tailwind.config.ts`

**Usage**:

```tsx
// ✅ CORRECT - Using design tokens
<div className="bg-primary-500 text-white p-4 rounded-lg shadow-card">
  <h1 className="text-lg">Title</h1>
</div>

// ❌ INCORRECT - Arbitrary values
<div className="bg-[#0ea5e9] text-white p-[16px] rounded-[8px]">
  <h1 className="text-[18px]">Title</h1>
</div>
```

**Available tokens**:

- **Colors**: `primary-{50-950}`, `secondary-{50-950}`, `success-{50-700}`, `error-{50-700}`, `warning-{50-700}`, `info-{50-700}`, `neutral-{50-950}`
- **Spacing**: Standard Tailwind + custom (`18`, `22`, `88`, `128`)
- **Typography**: `text-xs` to `text-4xl` with predefined line heights
- **Shadows**: `shadow-card`, `shadow-modal`, etc.
- **Z-index**: `z-dropdown`, `z-modal`, `z-tooltip`, etc.
- **Transitions**: `duration-fast`, `duration-normal`, `duration-slow`

**Benefits**: Consistency, easy theme changes, better maintainability

### Chakra UI Theme Tokens

- **ALWAYS use Chakra UI theme tokens** instead of inline color values
- **Location**: All theme tokens defined in `src/shared/design-tokens/theme/chakra-theme.ts`
- **NEVER use hardcoded color values** (e.g., `#1e88e5`, `rgb(30, 136, 229)`)
- **NEVER use CSS variables** (e.g., `var(--chakra-colors-icon-primary)`)

**MANDATORY: Use `useThemeToken` hook for third-party components**:

For non-Chakra components (lucide-react, react-icons, etc.), **ALWAYS use the `useThemeToken` hook**:

```tsx
import { useThemeToken } from "#shared/infrastructure/ui/hooks";

export function LoginPage() {
  const iconColor = useThemeToken("colors", "icon.primary");

  return (
    <Box bg="blue.100">
      <LogIn color={iconColor} size={32} />
    </Box>
  );
}
```

**For Chakra UI components**:

Use token strings directly in Chakra props:

```tsx
// ✅ CORRECT - Direct token usage in Chakra components
<Box bg="brand.500" color="icon.primary">
  <Text color="brand.600">Content</Text>
</Box>
```

**FORBIDDEN patterns**:

```tsx
// ❌ FORBIDDEN - Inline color values
<Box bg="#bbdefb">
  <LogIn color="#1e88e5" size={32} />
</Box>

// ❌ FORBIDDEN - CSS variables (use useThemeToken instead)
<LogIn color="var(--chakra-colors-icon-primary)" size={32} />

// ❌ FORBIDDEN - Token strings in non-Chakra components
<LogIn color="icon.primary" size={32} />
```

**Available semantic tokens**:

- **Icon colors**: `icon.primary` (brand.600)
- Access via `useThemeToken("colors", "icon.primary")`

**Available brand colors**:

- `brand.{50-900}` - Primary brand color palette
- Access via `useThemeToken("colors", "brand.600")` or Chakra props: `bg="brand.500"`

**When to add new tokens**:

1. If you need a color that's not in the theme, add it to `chakra-theme.ts` first
2. Create semantic tokens for commonly used colors (e.g., `icon.primary`, `text.primary`)
3. Never use inline hex/rgb values directly in components

**Why `useThemeToken` is mandatory**:

- ✅ **Type safety** - TypeScript validates categories and paths
- ✅ **Consistency** - Single pattern across the codebase
- ✅ **Resolves semantic tokens** - Automatically resolves references
- ✅ **Single source of truth** - Changes in theme reflect automatically
- ✅ **No magic strings** - Clearer than CSS variables

**Benefits**: Single source of truth, type safety, easy theme changes, consistent color usage

### Code Sorting (eslint-plugin-perfectionist)

- **Automatic sorting is enforced** via `eslint-plugin-perfectionist`
- **Always run `npm run lint -- --fix`** before committing to auto-sort
- **What gets sorted automatically**:
  - Imports (alphabetically, natural sorting)
  - Named imports/exports
  - Object properties
  - JSX props
  - Module exports
- **Benefits**: Consistent code style, easier to find things, reduces merge conflicts
- **No manual sorting needed** - ESLint will fix it automatically

### UI/UX Quality Standards

**CRITICAL**: All UI implementations MUST follow modern design principles. NO basic/ugly UIs allowed.

**Mandatory UI Requirements**:

1. **Use Chakra UI components** - ALWAYS check Chakra UI first before creating custom components
   - Import directly: `import { Button, Card, Input, FormControl } from "@chakra-ui/react"`
   - Available components: Button, Card, Input, FormControl, Modal, Menu, etc.
   - Documentation: https://chakra-ui.com/docs/components

2. **Modern spacing and layout**:
   - Use consistent padding/margin (p-4, p-6, gap-4, space-y-4)
   - Proper whitespace - don't cram elements
   - Responsive design with mobile-first approach

3. **Visual hierarchy**:
   - Clear headings: `text-2xl font-bold`, `text-lg font-semibold`
   - Proper text sizes: `text-base` for body, `text-sm` for secondary
   - Use color contrast: `text-neutral-900` for primary text, `text-neutral-600` for secondary

4. **Interactive elements**:
   - Hover states: `hover:bg-primary-600`, `hover:shadow-lg`
   - Focus states: `focus:ring-2 focus:ring-primary-500`
   - Disabled states: `disabled:opacity-50 disabled:cursor-not-allowed`
   - Loading states: Show spinners or skeleton screens

5. **Cards and containers**:
   - Use shadows: `shadow-card` or `shadow-lg`
   - Rounded corners: `rounded-lg` or `rounded-xl`
   - Borders when needed: `border border-neutral-200`

6. **Forms**:
   - Use Chakra UI FormControl components (with React Hook Form + Zod)
   - Clear labels and error messages
   - Proper input styling with focus states
   - Submit buttons should be prominent

7. **Icons**:
   - Use `lucide-react` for icons (already installed)
   - Consistent icon sizes: `size={20}` or `size={24}`
   - Example: `import { User, Mail, Lock } from "lucide-react"`

8. **Color usage**:
   - Primary actions: `bg-primary-500 hover:bg-primary-600`
   - Success: `bg-success-500`, Error: `bg-error-500`, Warning: `bg-warning-500`
   - Neutral backgrounds: `bg-neutral-50` or `bg-white`

**Examples of GOOD vs BAD UI**:

```tsx
// ❌ BAD - Basic, ugly UI
<div>
  <h1>Login</h1>
  <input type="text" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button>Login</button>
</div>

// ✅ GOOD - Modern, professional UI with Chakra
<Card maxW="md" mx="auto">
  <CardHeader>
    <Heading size="lg">Iniciar sesión</Heading>
    <Text color="gray.600">Ingresa tus credenciales para continuar</Text>
  </CardHeader>
  <CardBody>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!form.formState.errors.email}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Mail size={20} />
            </InputLeftElement>
            <Input {...form.register("email")} placeholder="tu@email.com" />
          </InputGroup>
          <FormErrorMessage>{form.formState.errors.email?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" width="full" size="lg" colorScheme="blue">
          Iniciar sesión
        </Button>
      </VStack>
    </form>
  </CardBody>
</Card>
```

**Reference for inspiration**:

- Modern fintech apps (Nubank, Revolut, N26)
- Clean, minimal design
- Proper spacing and typography
- Smooth transitions and interactions

### Domain Errors and Error Handling Flow

**CRITICAL**: This section defines how errors flow through the architecture layers following DDD and Hexagonal Architecture principles.

#### 1. Domain Layer: Pure Domain Errors

**Rules**:

- All domain errors MUST have their own custom error classes
- NEVER use generic `throw new Error()`
- Domain errors MUST be 100% UI-agnostic (NO UI metadata)
- Location: `src/contexts/{domain}/domain/errors/`

**Base Error Structure** (Shared):

```typescript
// src/shared/domain/errors/domainError.ts
export abstract class DomainError extends Error {
  constructor(
    message: string, // Technical message for logs
    public readonly code: string // Unique error code
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Domain-Specific Errors**:

```typescript
// src/contexts/auth/domain/errors/invalid-credentials.error.ts
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super(
      "Invalid credentials", // Technical message (for logs)
      "INVALID_CREDENTIALS" // Unique code (for mapping)
    );
  }
}

// src/contexts/auth/domain/errors/email-empty.error.ts
export class EmailEmptyError extends DomainError {
  constructor() {
    super("Email cannot be empty", "EMAIL_EMPTY");
  }
}
```

**Usage in Value Objects**:

```typescript
// src/contexts/auth/domain/value-objects/email.ts
export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    // ❌ INCORRECT - Generic error
    if (!value) throw new Error("Email cannot be empty");

    // ✅ CORRECT - Domain-specific error
    if (!value) throw new EmailEmptyError();

    if (!this.isValidFormat(value)) {
      throw new EmailInvalidFormatError();
    }

    return new Email(value);
  }
}
```

**Why NO UI metadata in domain errors?**

- ❌ Violates Separated Presentation principle
- ❌ Creates coupling between domain and UI
- ❌ Domain should not know how errors are displayed
- ✅ Domain only defines WHAT went wrong (code + technical message)
- ✅ Infrastructure layer decides HOW to present it

#### 2. Application Layer: Use Cases Propagate Errors

**Rules**:

- Use cases MUST NOT catch domain errors (let them bubble up)
- Use cases MUST NOT transform domain errors
- Use cases are transparent to domain errors
- Only catch errors if you need to add context or perform cleanup

**Correct Pattern**:

```typescript
// src/contexts/auth/application/use-cases/login.use-case.ts
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<User> {
    // ✅ CORRECT - Let domain errors bubble up naturally
    const credential = params.credential.includes("@")
      ? Email.create(params.credential) // May throw EmailEmptyError, EmailInvalidFormatError
      : Phone.create(params.credential); // May throw PhoneEmptyError, PhoneInvalidFormatError

    const user = await this.authRepository.findByCredential(credential);

    if (!user) {
      throw new InvalidCredentialsError(); // Domain error
    }

    return user;
  }
}
```

**When to catch in use cases** (rare cases):

```typescript
// Only if you need to add context or cleanup
async execute(params: Params): Promise<Result> {
  try {
    // ... domain logic
  } catch (error) {
    // Add context if needed
    if (error instanceof DomainError) {
      // Log for debugging, then re-throw
      console.error(`[LoginUseCase] ${error.code}:`, error.message);
      throw error; // ✅ Re-throw, don't wrap
    }
    throw error;
  }
}
```

**Anti-patterns**:

```typescript
// ❌ INCORRECT - Wrapping domain errors
catch (error) {
  throw new Error(`Login failed: ${error.message}`); // Loses type info!
}

// ❌ INCORRECT - Catching and returning null
catch (error) {
  return null; // Swallows the error!
}

// ❌ INCORRECT - Transforming to generic error
catch (error) {
  if (error instanceof EmailEmptyError) {
    throw new ValidationError(); // Loses specificity!
  }
}
```

#### 3. Infrastructure Layer: Error Mappers (Context-Specific)

**Rules**:

- Each bounded context has its own error mapper
- Mappers translate domain errors to UI presentations
- Location: `src/contexts/{domain}/infrastructure/ui/error-mapper/`
- Mappers implement `IErrorMapper` interface

**Shared Interface** (Infrastructure):

```typescript
// src/shared/infrastructure/ui/error-mapper/error-presentation.ts
export interface ErrorPresentation {
  title: string; // User-facing title (Spanish)
  description: string; // User-facing description (Spanish)
}

// src/shared/infrastructure/ui/error-mapper/error-mapper.interface.ts
export interface IErrorMapper {
  toPresentation(error: unknown): ErrorPresentation | null;
}
```

**Context-Specific Mapper**:

```typescript
// src/contexts/auth/infrastructure/ui/error-mapper/auth-error-mapper.ts
import { DomainError } from "#shared/domain/errors";
import {
  IErrorMapper,
  ErrorPresentation,
} from "#shared/infrastructure/ui/error-mapper";

export class AuthErrorMapper implements IErrorMapper {
  // Registry Pattern: Map error codes to UI messages
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    INVALID_CREDENTIALS: {
      title: "Credenciales inválidas",
      description: "Verifica tus credenciales e intenta nuevamente",
    },
    EMAIL_INVALID_FORMAT: {
      title: "Email inválido",
      description: "El formato del email no es válido",
    },
    EMAIL_EMPTY: {
      title: "Email vacío",
      description: "El email no puede estar vacío",
    },
    PHONE_INVALID_FORMAT: {
      title: "Teléfono inválido",
      description:
        "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos",
    },
    PHONE_EMPTY: {
      title: "Teléfono vacío",
      description: "El teléfono no puede estar vacío",
    },
  };

  toPresentation(error: unknown): ErrorPresentation | null {
    // Only handle domain errors from this context
    if (error instanceof DomainError) {
      const presentation = AuthErrorMapper.ERROR_MESSAGES[error.code];

      if (presentation) {
        return presentation; // Mapped error
      }

      // Fallback for unmapped domain errors
      return {
        title: "Error de validación",
        description: error.message,
      };
    }

    // Not a domain error from this context
    return null;
  }
}
```

**Why context-specific mappers?**

- ✅ Respects Bounded Contexts (DDD)
- ✅ Each context manages its own error messages
- ✅ No mixing of concerns in shared layer
- ✅ Scalable: adding contexts doesn't affect others
- ✅ Testable: each mapper tested independently

#### 4. Presentation Layer: UI Components Use Hook

**Rules**:

- UI components use `useErrorHandler` hook
- Hook accepts array of mappers (Chain of Responsibility)
- Catch blocks reduced to single line: `handleError(error)`
- Hook displays errors using Sileo toast notifications

**Shared Hook**:

```typescript
// src/shared/infrastructure/ui/hooks/use-error-handler.ts
import { useCallback } from "react";
import { sileo } from "sileo";
import { IErrorMapper, ErrorPresentation } from "../error-mapper";

export function useErrorHandler(mappers: IErrorMapper[] = []) {
  const handleError = useCallback(
    (error: unknown) => {
      let presentation: ErrorPresentation | null = null;

      // Chain of Responsibility: try each mapper
      for (const mapper of mappers) {
        presentation = mapper.toPresentation(error);
        if (presentation) break; // First match wins
      }

      // Fallback if no mapper handled the error
      if (!presentation) {
        presentation = {
          title: "Error inesperado",
          description: "Por favor, intenta nuevamente",
        };
      }

      // Display error to user
      sileo.error({
        title: presentation.title,
        description: presentation.description,
      });

      // Optional: Log to external service in production
      if (process.env.NODE_ENV === "production") {
        // errorLogger.log(error);
      }
    },
    [mappers]
  );

  return { handleError };
}
```

**Usage in UI Components**:

```typescript
// src/contexts/auth/infrastructure/ui/pages/login-page/login-page.tsx
import { useErrorHandler } from "#shared/infrastructure/ui/hooks";
import { AuthErrorMapper } from "#auth/infrastructure/ui/error-mapper";

export function LoginPage() {
  // Initialize hook with context-specific mapper
  const { handleError } = useErrorHandler([new AuthErrorMapper()]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const authRepository = new AuthRepository();
      const loginUseCase = new LoginUseCase(authRepository);

      // Domain errors bubble up from use case
      const user = await loginUseCase.execute({
        credential: data.credential,
      });

      // Success handling...
    } catch (error) {
      handleError(error); // ✅ Single line - mapper handles presentation
    }
  };

  return (/* JSX */);
}
```

**Multi-context example** (if a page uses multiple contexts):

```typescript
// Example: page using Auth + Wallet contexts
import { AuthErrorMapper } from "#auth/infrastructure/ui/error-mapper";
import { WalletErrorMapper } from "#wallet/infrastructure/ui/error-mapper";

export function TransferPage() {
  // Chain of Responsibility: tries Auth first, then Wallet
  const { handleError } = useErrorHandler([
    new AuthErrorMapper(),
    new WalletErrorMapper(),
  ]);

  // ... rest of component
}
```

#### 5. Complete Error Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DOMAIN LAYER (Pure Business Logic)                      │
│    - Value Objects throw domain-specific errors             │
│    - Errors have: code + technical message                  │
│    - NO UI metadata                                         │
│                                                             │
│    Email.create() → throws EmailEmptyError                  │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Propagates up ↑
┌────────────────────┴────────────────────────────────────────┐
│ 2. APPLICATION LAYER (Use Cases)                            │
│    - Use cases DO NOT catch domain errors                   │
│    - Errors bubble up transparently                         │
│    - May add logging but MUST re-throw                      │
│                                                             │
│    LoginUseCase.execute() → error bubbles up                │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Propagates up ↑
┌────────────────────┴────────────────────────────────────────┐
│ 3. INFRASTRUCTURE LAYER (Error Mapper)                      │
│    - Context-specific mapper translates errors              │
│    - Maps error.code → UI presentation                      │
│    - Registry pattern for mappings                          │
│                                                             │
│    AuthErrorMapper.toPresentation(error)                    │
│    → { title: "Email vacío", description: "..." }           │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Presentation ↓
┌────────────────────┴────────────────────────────────────────┐
│ 4. PRESENTATION LAYER (UI Components)                       │
│    - useErrorHandler hook with mapper                       │
│    - Single line: handleError(error)                        │
│    - Displays toast notification via Sileo                  │
│                                                             │
│    catch (error) { handleError(error); }                    │
│    → sileo.error({ title, description })                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 6. Benefits of This Architecture

| Aspect                     | Benefit                                         |
| -------------------------- | ----------------------------------------------- |
| **DDD Compliance**         | Domain is 100% UI-agnostic                      |
| **Hexagonal Architecture** | Infrastructure adapts domain to UI              |
| **Open/Closed Principle**  | New errors don't require modifying catch blocks |
| **Single Responsibility**  | Each layer has one reason to change             |
| **Bounded Contexts**       | Each context manages its own errors             |
| **Testability**            | Each layer tested independently                 |
| **Maintainability**        | Changes isolated to specific layers             |
| **Scalability**            | Easy to add new contexts and errors             |

#### 7. Testing Strategy

**Domain Errors**:

```typescript
// Test domain errors are thrown correctly
describe("Email.create", () => {
  it("should throw EmailEmptyError when value is empty", () => {
    expect(() => Email.create("")).toThrow(EmailEmptyError);
  });

  it("should throw EmailInvalidFormatError when format is invalid", () => {
    expect(() => Email.create("invalid")).toThrow(EmailInvalidFormatError);
  });
});
```

**Error Mappers**:

```typescript
// Test mapper returns correct presentations
describe("AuthErrorMapper", () => {
  const mapper = new AuthErrorMapper();

  it("should map EmailEmptyError to Spanish presentation", () => {
    const error = new EmailEmptyError();
    const result = mapper.toPresentation(error);

    expect(result).toEqual({
      title: "Email vacío",
      description: "El email no puede estar vacío",
    });
  });

  it("should return null for non-auth errors", () => {
    const error = new Error("Generic error");
    const result = mapper.toPresentation(error);

    expect(result).toBeNull();
  });
});
```

**Use Cases**:

```typescript
// Test use cases propagate domain errors
describe("LoginUseCase", () => {
  it("should propagate EmailEmptyError from domain", async () => {
    const useCase = new LoginUseCase(mockRepository);

    await expect(useCase.execute({ credential: "" })).rejects.toThrow(
      EmailEmptyError
    );
  });
});
```

#### 8. Anti-patterns to Avoid

```typescript
// ❌ FORBIDDEN: UI metadata in domain errors
export class EmailEmptyError extends DomainError {
  constructor() {
    super("Email cannot be empty", "EMAIL_EMPTY", {
      title: "Email vacío", // ❌ NO! This is UI concern
      description: "..."
    });
  }
}

// ❌ FORBIDDEN: Catching and wrapping in use cases
async execute(params: Params): Promise<Result> {
  try {
    return await this.repository.save(entity);
  } catch (error) {
    throw new Error(`Failed: ${error.message}`); // ❌ Loses type info
  }
}

// ❌ FORBIDDEN: Multiple if-else in catch blocks
catch (error) {
  if (error instanceof EmailEmptyError) {
    sileo.error({ title: "...", description: "..." });
  } else if (error instanceof EmailInvalidFormatError) {
    sileo.error({ title: "...", description: "..." });
  }
  // ... 20+ more lines
}

// ❌ FORBIDDEN: Generic error messages in UI
catch (error) {
  sileo.error({ title: "Error", description: "Something went wrong" });
  // User has no idea what happened!
}
```

#### 9. Summary Checklist

When implementing error handling, ensure:

- [ ] Domain errors extend `DomainError` with `code` and technical `message`
- [ ] Domain errors have NO UI metadata
- [ ] Use cases let domain errors bubble up (don't catch unless necessary)
- [ ] Each context has its own error mapper in `infrastructure/ui/error-mapper/`
- [ ] Mapper implements `IErrorMapper` interface
- [ ] Mapper uses Registry pattern for error code → presentation mapping
- [ ] UI components use `useErrorHandler` hook with context-specific mapper
- [ ] Catch blocks are single line: `handleError(error)`
- [ ] Error messages are in Spanish (user-facing)
- [ ] Tests cover domain errors, mappers, and use case propagation

### Enhanced Form Error Handling (Dual Feedback Pattern)

**CRITICAL**: For forms with inputs, use `useFormErrorHandler` instead of `useErrorHandler` to provide dual feedback.

#### Why Dual Feedback?

**Problem with toast-only errors:**

- User may miss the toast notification (3-5 seconds)
- No persistent visual indication on the form input
- User loses context about what went wrong

**Solution: Dual Feedback**

1. **Toast notification** (immediate, non-intrusive)
2. **Inline form error** (persistent, contextual)

#### Implementation Pattern

**1. Error Mapper with Form Field Mapping**

Each error mapper must implement both `toPresentation` and `toFormError`:

```typescript
export class AuthErrorMapper implements IErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    INVALID_CREDENTIALS: {
      title: "Credenciales inválidas",
      description: "Verifica tus credenciales e intenta nuevamente",
    },
  };

  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    INVALID_CREDENTIALS: {
      fieldName: "credential",
      message: "Credenciales inválidas",
    },
    EMAIL_INVALID_FORMAT: {
      fieldName: "credential",
      message: "El formato del email no es válido",
    },
  };

  toPresentation(error: unknown): ErrorPresentation | null {
    if (error instanceof DomainError) {
      return AuthErrorMapper.ERROR_MESSAGES[error.code] || null;
    }
    return null;
  }

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      return (
        AuthErrorMapper.FORM_ERROR_MAPPINGS[error.code] || {
          fieldName: "credential",
          message: error.message,
        }
      );
    }
    return null;
  }
}
```

**2. Use `useFormErrorHandler` Hook in Forms**

```typescript
import { useFormErrorHandler } from "#shared/infrastructure/ui/hooks";
import { AuthErrorMapper } from "#auth/infrastructure/ui/error-mapper";

export function LoginPage() {
  const form = useForm<LoginFormData>({
    defaultValues: { credential: "" },
    resolver: zodResolver(loginSchema),
  });

  const { handleError } = useFormErrorHandler({
    form,
    mappers: [new AuthErrorMapper()],
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginUseCase.execute(data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Field.Root invalid={!!form.formState.errors.credential}>
        <Field.Label>Email o Teléfono</Field.Label>
        <Input {...form.register("credential")} />
        {form.formState.errors.credential && (
          <Field.ErrorText>
            {form.formState.errors.credential.message}
          </Field.ErrorText>
        )}
      </Field.Root>
    </form>
  );
}
```

**3. Hook Options**

```typescript
useFormErrorHandler({
  form,
  mappers: [new AuthErrorMapper()],
  showToast: true,
});
```

- `form`: React Hook Form instance (must have `setError` method)
- `mappers`: Array of error mappers (Chain of Responsibility)
- `showToast`: Optional, default `true` (set to `false` to disable toast)

#### When to Use Each Hook

| Hook                  | Use Case                                      | Feedback             |
| --------------------- | --------------------------------------------- | -------------------- |
| `useErrorHandler`     | Non-form errors (API calls, navigation, etc.) | Toast only           |
| `useFormErrorHandler` | Form submissions with inputs                  | Toast + Inline error |

#### Error Flow with Forms

```
User submits form with invalid data
↓
Domain throws EmailInvalidFormatError
↓
useFormErrorHandler catches error
↓
1. Shows toast: "Email inválido"
2. Sets form error on "credential" field
↓
Input shows red border + error message
↓
User corrects input
↓
Error disappears automatically
```

#### Mapper Requirements for Forms

When creating error mappers for forms:

1. **Implement both methods:**
   - `toPresentation`: For toast notifications
   - `toFormError`: For inline form errors

2. **Map error codes to field names:**
   - Use exact field names from React Hook Form
   - One error can map to one field
   - Multiple errors can map to the same field

3. **Provide fallback:**
   - If error code not in registry, return generic mapping
   - Always return field name + message

4. **Spanish messages:**
   - All user-facing messages in Spanish
   - Technical messages (in error constructor) in English

#### Example: Multiple Field Form

```typescript
private static readonly FORM_ERROR_MAPPINGS: Record<string, FormErrorMapping> = {
  EMAIL_INVALID: {
    fieldName: "email",
    message: "Email inválido",
  },
  PASSWORD_TOO_SHORT: {
    fieldName: "password",
    message: "La contraseña debe tener al menos 8 caracteres",
  },
  PASSWORD_MISMATCH: {
    fieldName: "confirmPassword",
    message: "Las contraseñas no coinciden",
  },
};
```

#### Testing Form Error Handling

```typescript
describe("AuthErrorMapper - toFormError", () => {
  const mapper = new AuthErrorMapper();

  it("should map error to correct field", () => {
    const error = new EmailInvalidFormatError();
    const result = mapper.toFormError(error);

    expect(result).toEqual({
      fieldName: "credential",
      message: "El formato del email no es válido",
    });
  });

  it("should return null for non-domain errors", () => {
    const error = new Error("Generic error");
    expect(mapper.toFormError(error)).toBeNull();
  });
});
```

#### Common Patterns

**Pattern 1: Single input field (login, search)**

```typescript
FORM_ERROR_MAPPINGS: {
  ERROR_CODE_1: { fieldName: "query", message: "..." },
  ERROR_CODE_2: { fieldName: "query", message: "..." },
}
```

**Pattern 2: Multiple input fields (registration)**

```typescript
FORM_ERROR_MAPPINGS: {
  EMAIL_ERROR: { fieldName: "email", message: "..." },
  PASSWORD_ERROR: { fieldName: "password", message: "..." },
  NAME_ERROR: { fieldName: "name", message: "..." },
}
```

**Pattern 3: Nested fields**

```typescript
FORM_ERROR_MAPPINGS: {
  ADDRESS_ERROR: { fieldName: "address.street", message: "..." },
  CITY_ERROR: { fieldName: "address.city", message: "..." },
}
```

#### Architecture Compliance

- ✅ Domain remains UI-agnostic (no changes to domain errors)
- ✅ Infrastructure maps domain errors to UI concerns
- ✅ Backward compatible (`useErrorHandler` still works)
- ✅ Extensible (easy to add new field mappings)
- ✅ Testable (mappers and hooks are isolated)

### Import Rules

**CRITICAL**: NEVER use dynamic imports with `import()` syntax in the codebase.

**PROHIBITED**:

```typescript
// ❌ ABSOLUTELY FORBIDDEN - Dynamic imports
import("#auth/domain/entities").User;
const module = await import("#auth/domain/entities");
```

**CORRECT**:

```typescript
// ✅ ALWAYS use static imports
import { User } from "#auth/domain/entities";
```

**Reasons**:

- Dynamic imports are for code-splitting and lazy loading
- They return Promises and complicate type inference
- They break static analysis and tree-shaking
- They're unnecessary in this codebase architecture
- They make the code harder to understand and maintain

**Rule**: ALL imports MUST be static `import` statements at the top of the file.

### General Rules

- Follow ALL conventions and patterns defined in `DECISIONS.md`
- Respect the hexagonal architecture and DDD boundaries
- Use path aliases (NEVER relative paths)
- Write tests following the BDD structure (Given-When-Then)
- All code, variables, functions, and comments in English
- All user-facing text in Spanish
