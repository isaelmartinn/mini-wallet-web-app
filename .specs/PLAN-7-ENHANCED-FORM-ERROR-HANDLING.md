# Implementation Plan 7: Enhanced Form Error Handling with Visual Feedback

> **⚠️ CRITICAL PREREQUISITE**: Before starting any development work on this plan, you **MUST** read and fully understand the `AI_INSTRUCTIONS.md` file at the root of the project. Development cannot proceed without comprehending this file.

## Context and Objective

Enhance the current error handling system to provide dual feedback when domain errors occur:

1. **Toast notification** (immediate, non-intrusive feedback) - already implemented
2. **Inline form error** (persistent, contextual feedback) - NEW

Currently, when a domain error occurs (e.g., invalid email format), only a toast notification is shown. If the user misses the toast, they lose context about what went wrong. The form input does not show any visual indication of the error.

This plan adds persistent visual feedback by mapping domain errors to form fields, showing error messages directly on the inputs that caused the error.

## Architecture and Design

### Current State

- Domain errors → Toast notification only
- No persistent visual feedback on form inputs
- User can miss the error if toast disappears

### Target State

- Domain errors → Toast notification + Inline form error
- Persistent visual feedback until user corrects the input
- Error mapper knows which form field corresponds to each error
- React Hook Form displays the error on the specific field

### Key Components

- `FormErrorMapping` interface (shared)
- Extended `IErrorMapper` interface with `toFormError` method
- `useFormErrorHandler` hook (enhanced version of `useErrorHandler`)
- Updated `AuthErrorMapper` with form field mappings
- Refactored `LoginPage` to use enhanced hook

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **NO COMMENTS**: Do not add comments to code unless absolutely necessary for complex logic.
- **DDD Compliance**: Domain layer must remain 100% UI-agnostic.
- **Backward Compatibility**: Existing `useErrorHandler` hook must continue working.

## Implementation Steps

### 1. Shared Infrastructure - Form Error Mapping Types

**Files to create:**

- `src/shared/infrastructure/ui/error-mapper/form-error-mapping.ts`

**Tasks:**

1. Create `FormErrorMapping` interface with two properties:
   - `fieldName: string` - Name of the form field
   - `message: string` - Error message to display
2. Export interface in barrel file

**Implementation:**

```typescript
export interface FormErrorMapping {
  fieldName: string;
  message: string;
}
```

**Validation:**

- Interface is properly exported
- TypeScript compiles without errors

### 2. Extend IErrorMapper Interface

**File to modify:**

- `src/shared/infrastructure/ui/error-mapper/error-mapper.interface.ts`

**Tasks:**

1. Add new method signature to `IErrorMapper` interface:
   - Method name: `toFormError`
   - Parameter: `error: unknown`
   - Return type: `FormErrorMapping | null`
2. Keep existing `toPresentation` method unchanged
3. Update JSDoc to document the new method

**Implementation:**

```typescript
import { ErrorPresentation } from "./error-presentation";
import { FormErrorMapping } from "./form-error-mapping";

export interface IErrorMapper {
  toPresentation(error: unknown): ErrorPresentation | null;
  toFormError(error: unknown): FormErrorMapping | null;
}
```

**Validation:**

- Interface compiles without errors
- Both methods are defined
- Existing code using `IErrorMapper` still compiles

### 3. Update Shared Error Mapper Barrel Export

**File to modify:**

- `src/shared/infrastructure/ui/error-mapper/index.ts`

**Tasks:**

1. Add export for `FormErrorMapping` type

**Implementation:**

```typescript
export type { IErrorMapper } from "./error-mapper.interface";
export type { ErrorPresentation } from "./error-presentation";
export type { FormErrorMapping } from "./form-error-mapping";
```

**Validation:**

- All types are properly exported
- No compilation errors

### 4. Implement toFormError in AuthErrorMapper

**File to modify:**

- `src/contexts/auth/infrastructure/ui/error-mapper/auth-error-mapper.ts`

**Tasks:**

1. Add private static `FORM_ERROR_MAPPINGS` registry with mappings for:
   - `EMAIL_INVALID_FORMAT` → field: "credential", message in Spanish
   - `EMAIL_EMPTY` → field: "credential", message in Spanish
   - `PHONE_INVALID_FORMAT` → field: "credential", message in Spanish
   - `PHONE_INVALID_COUNTRY_CODE` → field: "credential", message in Spanish
   - `PHONE_EMPTY` → field: "credential", message in Spanish
   - `INVALID_CREDENTIALS` → field: "credential", message in Spanish
2. Implement `toFormError` method:
   - Check if error is instance of `DomainError`
   - Look up error code in `FORM_ERROR_MAPPINGS`
   - Return mapped `FormErrorMapping` if found
   - Return fallback mapping with generic message if not found
   - Return `null` if not a domain error
3. Keep existing `toPresentation` method unchanged

**Error Messages (Spanish):**

- `EMAIL_INVALID_FORMAT`: "El formato del email no es válido"
- `EMAIL_EMPTY`: "El email no puede estar vacío"
- `PHONE_INVALID_FORMAT`: "El formato del teléfono no es válido. Debe ser +52 seguido de 10 dígitos"
- `PHONE_INVALID_COUNTRY_CODE`: "El teléfono debe comenzar con +52"
- `PHONE_EMPTY`: "El teléfono no puede estar vacío"
- `INVALID_CREDENTIALS`: "Credenciales inválidas"

**Implementation Pattern:**

```typescript
import type {
  ErrorPresentation,
  FormErrorMapping,
  IErrorMapper,
} from "#shared/infrastructure/ui/error-mapper";
import { DomainError } from "#shared/domain/errors";

export class AuthErrorMapper implements IErrorMapper {
  private static readonly ERROR_MESSAGES: Record<string, ErrorPresentation> = {
    // existing mappings
  };

  private static readonly FORM_ERROR_MAPPINGS: Record<
    string,
    FormErrorMapping
  > = {
    EMAIL_INVALID_FORMAT: {
      fieldName: "credential",
      message: "El formato del email no es válido",
    },
    // ... rest of mappings
  };

  toPresentation(error: unknown): ErrorPresentation | null {
    // existing implementation - DO NOT MODIFY
  }

  toFormError(error: unknown): FormErrorMapping | null {
    if (error instanceof DomainError) {
      const mapping = AuthErrorMapper.FORM_ERROR_MAPPINGS[error.code];

      if (mapping) {
        return mapping;
      }

      return {
        fieldName: "credential",
        message: error.message,
      };
    }

    return null;
  }
}
```

**Validation:**

- Class implements `IErrorMapper` interface correctly
- All error codes are mapped
- Method returns correct types
- TypeScript compiles without errors

### 5. Create useFormErrorHandler Hook

**Files to create:**

- `src/shared/infrastructure/ui/hooks/use-form-error-handler.ts`

**Tasks:**

1. Create hook that accepts options object with:
   - `form` object with `setError` method (from React Hook Form)
   - `mappers` array of `IErrorMapper[]`
   - `showToast` optional boolean (default: true)
2. Implement `handleError` function using `useCallback` that:
   - Tries each mapper to get `ErrorPresentation` and `FormErrorMapping`
   - Shows toast notification if `showToast` is true (using existing logic)
   - Calls `form.setError` with field name and message if mapping exists
   - Uses type: "manual" for setError
3. Return object with `handleError` function
4. Use proper TypeScript generics for form field values

**Implementation Pattern:**

```typescript
import { useCallback } from "react";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { sileo } from "sileo";
import type { IErrorMapper, ErrorPresentation } from "../error-mapper";

interface UseFormErrorHandlerOptions<TFieldValues extends FieldValues> {
  form: {
    setError: UseFormSetError<TFieldValues>;
  };
  mappers: IErrorMapper[];
  showToast?: boolean;
}

export function useFormErrorHandler<TFieldValues extends FieldValues>({
  form,
  mappers,
  showToast = true,
}: UseFormErrorHandlerOptions<TFieldValues>) {
  const handleError = useCallback(
    (error: unknown) => {
      let presentation: ErrorPresentation | null = null;
      let formErrorMapping = null;

      for (const mapper of mappers) {
        presentation = mapper.toPresentation(error);
        formErrorMapping = mapper.toFormError(error);

        if (presentation || formErrorMapping) break;
      }

      if (showToast) {
        const toastPresentation = presentation || {
          title: "Error inesperado",
          description: "Por favor, intenta nuevamente",
        };

        sileo.error({
          title: toastPresentation.title,
          description: toastPresentation.description,
        });
      }

      if (formErrorMapping) {
        form.setError(formErrorMapping.fieldName as Path<TFieldValues>, {
          type: "manual",
          message: formErrorMapping.message,
        });
      }
    },
    [form, mappers, showToast]
  );

  return { handleError };
}
```

**Validation:**

- Hook compiles without errors
- Proper TypeScript generics
- useCallback dependencies are correct
- Returns handleError function

### 6. Update Shared Hooks Barrel Export

**File to modify:**

- `src/shared/infrastructure/ui/hooks/index.ts`

**Tasks:**

1. Add export for `useFormErrorHandler`
2. Keep existing `useErrorHandler` export

**Implementation:**

```typescript
export { useErrorHandler } from "./use-error-handler";
export { useFormErrorHandler } from "./use-form-error-handler";
```

**Validation:**

- Both hooks are exported
- No compilation errors

### 7. Refactor LoginPage to Use Enhanced Hook

**File to modify:**

- `src/contexts/auth/infrastructure/ui/pages/login-page/login-page.tsx`

**Tasks:**

1. Replace `useErrorHandler` import with `useFormErrorHandler`
2. Update hook initialization to pass `form` object and mappers
3. Keep everything else unchanged (form structure, onSubmit logic, etc.)

**Before:**

```typescript
const { handleError } = useErrorHandler([new AuthErrorMapper()]);
```

**After:**

```typescript
const { handleError } = useFormErrorHandler({
  form,
  mappers: [new AuthErrorMapper()],
});
```

**Validation:**

- Component compiles without errors
- Form error display already exists in JSX (no changes needed)
- Hook is called with correct parameters

### 8. Create Unit Tests for toFormError

**File to create:**

- `src/contexts/auth/infrastructure/ui/error-mapper/auth-error-mapper-form.spec.ts`

**Tasks:**

1. Test `toFormError` method for all error codes
2. Test fallback for unmapped domain errors
3. Test returns null for non-domain errors
4. Use same structure as existing `auth-error-mapper.spec.ts`

**Test Cases:**

- Should map EmailInvalidFormatError to credential field
- Should map EmailEmptyError to credential field
- Should map PhoneInvalidFormatError to credential field
- Should map PhoneInvalidCountryCodeError to credential field
- Should map PhoneEmptyError to credential field
- Should map InvalidCredentialsError to credential field
- Should return fallback mapping for unmapped domain error
- Should return null for non-domain errors

**Implementation Pattern:**

```typescript
import { describe, expect, it } from "vitest";
import {
  EmailEmptyError,
  EmailInvalidFormatError,
  InvalidCredentialsError,
  PhoneEmptyError,
  PhoneInvalidCountryCodeError,
  PhoneInvalidFormatError,
  ValidationError,
} from "#auth/domain/errors";
import { AuthErrorMapper } from "./auth-error-mapper";

describe("AuthErrorMapper - toFormError", () => {
  const mapper = new AuthErrorMapper();

  describe("toFormError", () => {
    it("should map EmailInvalidFormatError to credential field", () => {
      const error = new EmailInvalidFormatError();
      const result = mapper.toFormError(error);

      expect(result).toEqual({
        fieldName: "credential",
        message: "El formato del email no es válido",
      });
    });

    // ... rest of tests following same pattern
  });
});
```

**Validation:**

- All tests pass
- Code coverage for `toFormError` method

### 9. Create Unit Tests for useFormErrorHandler

**File to create:**

- `src/shared/infrastructure/ui/hooks/use-form-error-handler.spec.ts`

**Tasks:**

1. Mock `sileo.error`
2. Create mock form with `setError` spy
3. Test that hook calls both `sileo.error` and `form.setError`
4. Test with `showToast: false` option
5. Test fallback when no mapper handles error
6. Use `renderHook` from `@testing-library/react`

**Test Cases:**

- Should show toast and set form error when mapper returns both
- Should only show toast when mapper returns only presentation
- Should only set form error when mapper returns only form mapping
- Should not show toast when showToast is false
- Should show fallback toast when no mapper handles error
- Should not set form error when no form mapping exists

**Validation:**

- All tests pass
- Proper use of renderHook
- Mocks are properly configured

### 10. Manual Testing Checklist

**Test Scenarios:**

1. Enter invalid email format → Check toast appears + input shows error
2. Enter empty credential → Check toast appears + input shows error
3. Enter invalid phone format → Check toast appears + input shows error
4. Enter phone without +52 → Check toast appears + input shows error
5. Enter valid credential then invalid → Check error appears
6. Correct invalid credential → Check error disappears
7. Submit with invalid credentials → Check both feedbacks appear

**Validation:**

- All scenarios work as expected
- Error persists on input until corrected
- Toast and inline error messages match
- No console errors

## Acceptance Criteria

### Functional Requirements

- [ ] Domain errors show both toast notification and inline form error
- [ ] Form input displays error message persistently
- [ ] Form input shows visual error state (red border via Chakra `invalid` prop)
- [ ] Error disappears when user corrects the input
- [ ] All error messages are in Spanish
- [ ] Toast notification still works as before

### Technical Requirements

- [ ] Domain layer remains 100% UI-agnostic (no changes)
- [ ] `IErrorMapper` interface extended with `toFormError` method
- [ ] `AuthErrorMapper` implements both `toPresentation` and `toFormError`
- [ ] `useFormErrorHandler` hook works with React Hook Form
- [ ] Existing `useErrorHandler` hook continues working (backward compatible)
- [ ] All TypeScript types are correct (no `any`)
- [ ] All tests pass with >90% coverage
- [ ] No code comments added (unless absolutely necessary)

### Architecture Requirements

- [ ] DDD principles respected (domain is UI-agnostic)
- [ ] Hexagonal architecture respected (infrastructure maps domain to UI)
- [ ] Single Responsibility: each component has one reason to change
- [ ] Open/Closed: can add new error mappings without modifying existing code
- [ ] Backward compatible: existing code using `useErrorHandler` still works

## Test Plan

### Unit Tests

- **AuthErrorMapper.toFormError**: Test all error code mappings and edge cases
- **useFormErrorHandler**: Test dual feedback, toast control, and fallbacks

### Integration Tests

- **LoginPage**: Test that errors are displayed correctly in form
- Verify error messages match expected Spanish translations
- Test with valid and invalid credentials

### Manual Testing

- [ ] Test all error scenarios in LoginPage
- [ ] Verify toast appears and disappears
- [ ] Verify inline error persists until corrected
- [ ] Verify error disappears when input is corrected
- [ ] Test on different screen sizes

## Risks and Mitigations

| Risk                             | Impact | Mitigation                                         |
| -------------------------------- | ------ | -------------------------------------------------- |
| Breaking existing error handling | High   | Keep `useErrorHandler` unchanged, create new hook  |
| Form field name mismatch         | Medium | Use constants for field names, comprehensive tests |
| TypeScript generic complexity    | Low    | Follow React Hook Form types exactly               |
| Missing error mappings           | Medium | Fallback to generic field + error message          |

## Recommended Tools and Guides

### References

- **React Hook Form - setError**: https://react-hook-form.com/docs/useform/seterror
- **React Hook Form - TypeScript**: https://react-hook-form.com/ts
- **Chakra UI - Field Component**: https://chakra-ui.com/docs/components/field

### Design Patterns

- **Registry Pattern**: For error code to form field mappings
- **Chain of Responsibility**: For trying multiple mappers
- **Adapter Pattern**: Mappers adapt domain errors to UI concerns

### Testing

- Vitest for unit tests
- @testing-library/react for hook testing
- Mock `sileo.error` to verify toast calls
- Spy on `form.setError` to verify form error calls

## Implementation Order

1. ✅ Create `FormErrorMapping` interface
2. ✅ Extend `IErrorMapper` interface
3. ✅ Update barrel exports
4. ✅ Implement `toFormError` in `AuthErrorMapper`
5. ✅ Create `useFormErrorHandler` hook
6. ✅ Update hooks barrel export
7. ✅ Refactor `LoginPage`
8. ✅ Create unit tests for `toFormError`
9. ✅ Create unit tests for `useFormErrorHandler`
10. ✅ Manual testing and validation

## Success Metrics

- **UX Improvement**: Users can see errors persistently on form inputs
- **Error Clarity**: 100% of domain errors mapped to specific form fields
- **Backward Compatibility**: 0 breaking changes to existing code
- **Test Coverage**: >90% for new code
- **Code Quality**: 0 comments added (clean, self-documenting code)

## Future Enhancements (Out of Scope)

- Multi-field error support (one error affecting multiple fields)
- Error focus management (auto-focus first error field)
- Error summary component (list all errors at top of form)
- Animated error transitions
- Custom error styling per error type
