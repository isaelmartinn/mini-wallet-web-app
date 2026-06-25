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

### shadcn/ui Components

- **Install components ONLY when needed** in the project
- Do NOT install all components upfront
- When you need a UI component:
  1. Check if it exists in shadcn/ui library first
  2. If it exists, install it using: `npx shadcn@latest add <component-name>`
  3. Only create custom components if the functionality doesn't exist in shadcn/ui or is very business-specific

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
- **Setup**: Add `<Toaster position="top-right" />` in root `app/layout.tsx`
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
- ❌ **NO inline types** - Always define types/interfaces in separate files or at file top
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

1. **Use shadcn/ui components** - ALWAYS check shadcn/ui first before creating custom components
   - Install with: `npx shadcn@latest add <component-name>`
   - Available components: button, card, input, form, dialog, dropdown-menu, etc.

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
   - Use shadcn/ui Form components (with React Hook Form + Zod)
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

// ✅ GOOD - Modern, professional UI
<Card className="mx-auto w-full max-w-md">
  <CardHeader>
    <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
    <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-5 text-neutral-400" />
                  <Input {...field} className="pl-10" placeholder="tu@email.com" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg">
          Iniciar sesión
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>
```

**Reference for inspiration**:

- Modern fintech apps (Nubank, Revolut, N26)
- Clean, minimal design
- Proper spacing and typography
- Smooth transitions and interactions

### General Rules

- Follow ALL conventions and patterns defined in `DECISIONS.md`
- Respect the hexagonal architecture and DDD boundaries
- Use path aliases (NEVER relative paths)
- Write tests following the BDD structure (Given-When-Then)
- All code, variables, functions, and comments in English
- All user-facing text in Spanish
