# Implementation Plan 2: Wallet Domain (Balance and Profile)

> **⚠️ CRITICAL PREREQUISITE**: Before starting any development work on this plan, you **MUST** read and fully understand the `AI_INSTRUCTIONS.md` file at the root of the project. Development cannot proceed without comprehending this file.

## Context and Objective

Implement the visualization of available balance and basic user information on the main screen (Home). This is the core informational part of the wallet.

## Architecture and Design

- **Domain**: `wallet`
- **Entities**: `Balance`, `UserProfile`
- **Value Objects**: `Amount` (monetary)
- **Use Cases**: `GetBalanceUseCase`, `GetUserProfileUseCase`
- **Infrastructure**: `WalletRepository` (Mock), `WalletStore` (Zustand), `HomePage` (top section)

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a `shadcn/ui` alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Domain Layer

- Implement `Amount` VO with logic for handling decimals and comparisons.
- Implement `Balance` entity (amount + currency).
- Implement `UserProfile` entity (full name, initials).

### 2. Application Layer

- Implement `GetBalanceUseCase`: Retrieves the current balance for the authenticated user.
- Implement `GetUserProfileUseCase`: Retrieves user profile information.

### 3. Infrastructure Layer (Persistence and State)

- Implement `WalletRepository` with initial mocked data.
- Create `useWalletStore` to cache balance and profile, avoiding unnecessary requests.

### 4. Infrastructure Layer (UI)

- Create `BalanceCard` component (Shows amount with option to hide/show balance).
- Create `UserHeader` component (Shows name and welcome message).
- Implement basic `HomePage` in `src/contexts/wallet/infrastructure/ui/pages`.
- Configure the `/home` route in `app/(dashboard)/home/page.tsx`.

## Acceptance Criteria

- Balance is displayed correctly formatted (e.g., $1,234.56).
- User name is correctly displayed in the header.
- Loading states (skeletons) visible while fetching data.

## Test Plan

- **Unit (Domain)**: Tests for `Amount` VO (addition, subtraction, comparisons).
- **Unit (Application)**: Tests for use cases with mocked repositories.
- **Components**: Test `BalanceCard` to verify currency formatting.
- **E2E**: Verify that upon entering Home, the balance and name match the logged-in user's data.

## Risks and Mitigations

- **Risk**: Balance desynchronization if updated in other domains.
- **Mitigation**: `WalletStore` should expose methods to update balance that can be called by other processes (or via events).

## Recommended Tools and Guides

- `Intl.NumberFormat` for currency formatting.
- Lucide React for icons.
