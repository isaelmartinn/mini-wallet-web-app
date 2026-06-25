# Implementation Plan 1: Authentication Domain (Auth)

## Context and Objective
Implement the mocked authentication system that allows users to log in to the application using phone or email. A simple session must be persisted to allow access to the dashboard.

## Architecture and Design
- **Domain**: `auth`
- **Entities**: `User`
- **Value Objects**: `Email`, `Phone`
- **Use Cases**: `LoginUseCase`, `LogoutUseCase`, `ValidateSessionUseCase`
- **Infrastructure**: `AuthRepository` (Mock), `AuthStore` (Zustand), `LoginPage`

## General Implementation Rules (Applicable to all plans)
- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a `shadcn/ui` alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Domain Layer
- Define interface and implementation for `Email` and `Phone` VOs with format validations.
- Define interface and implementation for the `User` entity.
- Define specific error interfaces (`InvalidCredentialsError`, `ValidationError`).

### 2. Application Layer
- Implement `LoginUseCase`: Validates credentials against the repository and returns the user.
- Implement `LogoutUseCase`: Clears the session.
- Implement `ValidateSessionUseCase`: Checks if there is an active session when the app loads.

### 3. Infrastructure Layer (Persistence and State)
- Implement `AuthRepository` with mocked data and `localStorage` persistence.
- Create `useAuthStore` with Zustand to manage the global session state.

### 4. Infrastructure Layer (UI)
- Create atomic components for the login form (Label, Input, ErrorMessage).
- Implement `LoginPage` in `src/contexts/auth/infrastructure/ui/pages`.
- Configure the `/login` route in `app/(auth)/login/page.tsx`.
- Implement protected redirection: if no session exists, redirect to `/login`.

## Acceptance Criteria
- Login form validates email and phone formats.
- Successful login redirects to `/home`.
- Session persists after page reload.
- Logout clears the session and redirects to `/login`.

## Test Plan
- **Unit (Domain)**: Tests for `Email` and `Phone` VOs with valid and invalid cases.
- **Unit (Application)**: Mock the repository and test `LoginUseCase` with success and error.
- **Components**: Test `LoginPage` verifying it shows validation errors.
- **E2E**: Full login flow from data entry to redirection to Home.

## Risks and Mitigations
- **Risk**: Inconsistent handling of loading states.
- **Mitigation**: Use clear loading states in the store and components.

## Recommended Tools and Guides
- React Hook Form for form management.
- Zod for schema validations.
