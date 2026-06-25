# Implementation Plan 6: Refactor Domain Error Handling

> **⚠️ CRITICAL PREREQUISITE**: Before starting any development work on this plan, you **MUST** read and fully understand the `AI_INSTRUCTIONS.md` file at the root of the project. Development cannot proceed without comprehending this file.

## Context and Objective

Refactor the current error handling approach in the Auth context to follow DDD and Hexagonal Architecture principles. The current implementation has multiple `if-else` statements in the catch block (lines 60-101 in `login-page.tsx`), which violates the Open/Closed principle and creates tight coupling between UI and domain errors.

The solution implements a **Context-specific Error Mapper** pattern where each bounded context has its own error mapper, keeping the domain layer pure and UI-agnostic while centralizing error presentation logic in the infrastructure layer.

## Architecture and Design

### Current State (Anti-pattern)

- UI layer directly handles all domain error types with multiple `if-else` statements
- Tight coupling between presentation and domain errors
- Violates Open/Closed principle (adding new errors requires modifying catch blocks)
- Error presentation logic scattered across UI components

### Target State (DDD-compliant)

- **Shared Layer**: Generic error handling infrastructure (interfaces, types, hooks)
- **Auth Context**: Context-specific error mapper (`AuthErrorMapper`)
- **Domain Layer**: Pure domain errors with only `code` and technical `message`
- **Infrastructure/UI Layer**: Error mappers translate domain errors to UI presentations
- **Presentation Layer**: Single-line error handling using `useErrorHandler` hook

### Key Components

- `IErrorMapper` interface (shared)
- `ErrorPresentation` type (shared)
- `useErrorHandler` hook (shared, generic)
- `AuthErrorMapper` class (auth context-specific)
- Refactored `LoginPage` component

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **DDD Compliance**: Domain layer must be 100% UI-agnostic. No UI-related metadata in domain errors.
- **Bounded Contexts**: Each context manages its own error mappings independently.

## Implementation Steps

### 1. Shared Infrastructure - Error Handling Foundation

**Files to create:**

- `src/shared/infrastructure/ui/error-mapper/error-presentation.ts`
- `src/shared/infrastructure/ui/error-mapper/error-mapper.interface.ts`
- `src/shared/infrastructure/ui/error-mapper/index.ts`
- `src/shared/infrastructure/ui/hooks/use-error-handler.ts`
- `src/shared/infrastructure/ui/hooks/index.ts`

**Tasks:**

1. Create `ErrorPresentation` interface with `title` and `description` properties (both strings)
2. Create `IErrorMapper` interface with single method: `toPresentation(error: unknown): ErrorPresentation | null`
3. Implement `useErrorHandler` hook that:
   - Accepts an array of `IErrorMapper[]` as parameter
   - Implements Chain of Responsibility pattern to try each mapper sequentially
   - Returns first non-null presentation
   - Falls back to generic error message if no mapper handles the error
   - Displays error using `sileo.error()`
   - Returns `{ handleError }` function
4. Create barrel exports in `index.ts` files

**Validation:**

- TypeScript compiles without errors
- Interfaces are properly exported
- Hook accepts mapper array and returns handleError function

### 2. Auth Context - Error Mapper Implementation

**Files to create:**

- `src/contexts/auth/infrastructure/ui/error-mapper/auth-error-mapper.ts`
- `src/contexts/auth/infrastructure/ui/error-mapper/index.ts`

**Tasks:**

1. Create `AuthErrorMapper` class implementing `IErrorMapper`
2. Define private static `ERROR_MESSAGES` registry with mappings for:
   - `INVALID_CREDENTIALS`: "Credenciales inválidas" / "Verifica tus credenciales e intenta nuevamente"
   - `EMAIL_INVALID_FORMAT`: "Email inválido" / "El formato del email no es válido"
   - `EMAIL_EMPTY`: "Email vacío" / "El email no puede estar vacío"
   - `PHONE_INVALID_FORMAT`: "Teléfono inválido" / "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos"
   - `PHONE_INVALID_COUNTRY_CODE`: "Código de país inválido" / "El teléfono debe comenzar con +52"
   - `PHONE_EMPTY`: "Teléfono vacío" / "El teléfono no puede estar vacío"
3. Implement `toPresentation` method that:
   - Checks if error is instance of `DomainError`
   - Looks up error code in `ERROR_MESSAGES` registry
   - Returns mapped presentation if found
   - Returns generic validation error if domain error but not in registry
   - Returns `null` if not a domain error (allows other mappers to handle)
4. Create barrel export

**Validation:**

- Class implements `IErrorMapper` interface correctly
- All current auth error codes are mapped
- Method returns null for non-auth errors
- TypeScript compiles without errors

### 3. Refactor LoginPage Component

**File to modify:**

- `src/contexts/auth/infrastructure/ui/pages/login-page/login-page.tsx`

**Tasks:**

1. Import `useErrorHandler` from `#shared/infrastructure/ui/hooks`
2. Import `AuthErrorMapper` from `#auth/infrastructure/ui/error-mapper`
3. Initialize hook: `const { handleError } = useErrorHandler([new AuthErrorMapper()])`
4. Replace entire catch block (lines 60-101) with single line: `handleError(error)`
5. Remove unused error imports (keep only what's needed for types if any)

**Before (lines 60-101):**

```typescript
} catch (error) {
  if (error instanceof InvalidCredentialsError) {
    sileo.error({ ... });
  } else if (error instanceof EmailInvalidFormatError) {
    sileo.error({ ... });
  }
  // ... 30+ lines of if-else
}
```

**After:**

```typescript
} catch (error) {
  handleError(error);
}
```

**Validation:**

- Component compiles without errors
- All error type imports removed except those used elsewhere
- Catch block reduced to single line
- Functionality remains identical to previous implementation

### 4. Verify Domain Layer Purity

**Files to verify (DO NOT MODIFY):**

- `src/shared/domain/errors/domainError.ts`
- `src/contexts/auth/domain/errors/*.ts`

**Tasks:**

1. Verify `DomainError` base class only has:
   - `message: string`
   - `code: string`
   - NO UI-related metadata
2. Verify all auth domain errors extend `DomainError` correctly
3. Verify domain errors only contain technical messages (for logs)
4. Document verification in implementation notes

**Validation:**

- Domain layer has zero UI dependencies
- No imports from infrastructure or UI layers
- Error codes are unique and descriptive

### 5. Create Unit Tests

**Files to create:**

- `src/shared/infrastructure/ui/hooks/use-error-handler.spec.ts`
- `src/contexts/auth/infrastructure/ui/error-mapper/auth-error-mapper.spec.ts`

**Tasks for `auth-error-mapper.spec.ts`:**

1. Test: Returns correct presentation for each error code
2. Test: Returns generic validation error for unmapped domain error
3. Test: Returns null for non-domain errors
4. Test: Handles unknown error gracefully

**Tasks for `use-error-handler.spec.ts`:**

1. Test: Calls first mapper that returns non-null
2. Test: Tries all mappers in order (Chain of Responsibility)
3. Test: Falls back to generic error if all mappers return null
4. Test: Calls sileo.error with correct parameters
5. Mock `sileo.error` to verify calls

**Validation:**

- All tests pass
- Code coverage > 90% for new code
- Tests are isolated and don't depend on external state

### 6. Documentation and Cleanup

**Tasks:**

1. Add JSDoc comments to:
   - `IErrorMapper` interface
   - `useErrorHandler` hook
   - `AuthErrorMapper` class
2. Update any existing documentation referencing error handling
3. Remove any dead code from previous implementation
4. Verify all imports use path aliases correctly (`#shared`, `#auth`)

**Validation:**

- JSDoc comments are clear and concise
- No broken imports
- No unused imports or variables
- ESLint passes without warnings

## Acceptance Criteria

### Functional Requirements

- [ ] Login page displays correct error messages for all error types
- [ ] Error messages are in Spanish (user-facing)
- [ ] Error handling works identically to previous implementation
- [ ] No regression in user experience

### Technical Requirements

- [ ] Domain layer has zero UI dependencies
- [ ] Each bounded context has its own error mapper
- [ ] Catch block in LoginPage is single line
- [ ] `useErrorHandler` hook is reusable across contexts
- [ ] Chain of Responsibility pattern implemented correctly
- [ ] All TypeScript types are correct (no `any`)
- [ ] All tests pass with >90% coverage

### Architecture Requirements

- [ ] DDD principles respected (domain is UI-agnostic)
- [ ] Hexagonal architecture respected (infrastructure translates)
- [ ] Open/Closed principle: new errors don't require modifying catch blocks
- [ ] Single Responsibility: each class has one reason to change
- [ ] Bounded contexts are independent

## Test Plan

### Unit Tests

- **AuthErrorMapper**: Test all error code mappings and edge cases
- **useErrorHandler**: Test Chain of Responsibility and fallback logic

### Integration Tests

- **LoginPage**: Test that errors are displayed correctly
- Verify error messages match expected Spanish translations
- Test with valid and invalid credentials

### Manual Testing

- [ ] Test login with invalid credentials
- [ ] Test login with invalid email format
- [ ] Test login with invalid phone format
- [ ] Test login with empty fields
- [ ] Verify all error messages are in Spanish
- [ ] Verify error messages are clear and helpful

## Risks and Mitigations

| Risk                                          | Impact | Mitigation                                          |
| --------------------------------------------- | ------ | --------------------------------------------------- |
| Breaking existing error handling              | High   | Thorough testing before deployment                  |
| Missing error code mappings                   | Medium | Fallback to generic message + comprehensive testing |
| Performance impact of Chain of Responsibility | Low    | Mappers are lightweight, early return on match      |
| Future contexts not following pattern         | Medium | Clear documentation and code examples               |

## Recommended Tools and Guides

### References

- **Martin Fowler - Notification Pattern**: https://martinfowler.com/eaaDev/Notification.html
- **Vladimir Khorikov - Error Mapping**: https://khorikov.org/posts/2022-02-28-error-mapping/
- **Microsoft - DDD Validations**: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations

### Design Patterns

- **Chain of Responsibility**: For trying multiple mappers sequentially
- **Registry Pattern**: For error code to message mappings
- **Adapter Pattern**: Mappers adapt domain errors to UI presentations

### Testing

- Vitest for unit tests
- React Testing Library for component tests
- Mock `sileo.error` to verify error display calls

## Implementation Order

1. ✅ Create shared infrastructure (interfaces, types, hooks)
2. ✅ Create auth error mapper
3. ✅ Refactor LoginPage component
4. ✅ Verify domain layer purity
5. ✅ Create unit tests
6. ✅ Documentation and cleanup
7. ✅ Manual testing and validation

## Success Metrics

- **Code Reduction**: Catch block reduced from ~40 lines to 1 line
- **Maintainability**: Adding new error requires only updating mapper registry
- **Testability**: Error presentation logic is isolated and easily testable
- **Extensibility**: Pattern can be applied to other contexts (wallet, transactions)
- **DDD Compliance**: Domain layer is 100% UI-agnostic

## Future Enhancements (Out of Scope)

- Global error boundary for unexpected errors
- Error logging service integration
- Analytics tracking for error occurrences
- i18n support for multi-language error messages
- Error retry mechanisms
