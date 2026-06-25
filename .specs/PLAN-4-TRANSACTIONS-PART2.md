# Implementation Plan 4: Transactions - Part 2 (Contacts and Transfer Flow)

> **⚠️ CRITICAL PREREQUISITE**: Before starting any development work on this plan, you **MUST** read and fully understand the `AI_INSTRUCTIONS.md` file at the root of the project. Development cannot proceed without comprehending this file.

## Context and Objective

Implement the functionality to send money, including contact selection (favorites or manual) and validation of business rules before confirmation.

## Architecture and Design

- **Domain**: `transactions` / `contacts`
- **Entities**: `Contact`
- **Domain Services**: `TransactionValidationService`
- **Use Cases**: `GetContactsUseCase`, `AddContactUseCase`, `PrepareTransactionUseCase`
- **Infrastructure**: `ContactRepository` (Mock), `NewTransactionPage` (Form)

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a `shadcn/ui` alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Domain Layer

- Implement `Contact` entity (name, phone/email, isFavorite).
- Implement `TransactionValidationService`: Service that centralizes the rules:
  - Amount > 0.
  - Sufficient balance (injecting `BalanceProvider` interface).
  - Valid recipient.

### 2. Application Layer

- Implement `GetContactsUseCase`: Retrieves favorites and recent contacts list.
- Implement `AddContactUseCase`: Allows saving a new contact.
- Implement `PrepareTransactionUseCase`: Validates initial data and prepares the transaction "Draft".

### 3. Infrastructure Layer (UI - Contact Selection)

- Create `ContactSelector` component: Contact list with search.
- Create modal/form for "New Contact".

### 4. Infrastructure Layer (UI - Transfer Form)

- Implement `NewTransactionPage` in `src/contexts/transactions/infrastructure/ui/pages`.
- Step 1: Enter Amount and Select Recipient.
- Step 2: Show Transaction Summary.
- Configure `/transactions/new` route in `app/(dashboard)/transactions/new/page.tsx`.

## Acceptance Criteria

- Cannot proceed without a valid amount (> 0).
- Cannot proceed if amount exceeds available balance.
- A contact can be selected from the list or a new one can be entered.
- Summary clearly shows who receives and how much is sent.

## Test Plan

- **Unit (Domain Service)**: Exhaustive tests for `TransactionValidationService` covering all business rule failures.
- **Unit (Application)**: Test `AddContactUseCase` and `PrepareTransactionUseCase`.
- **Components**: Test transfer form verifying "Next" button enabling/disabling.
- **E2E**: Flow of completing the form, selecting a contact, and seeing the summary correctly.

## Risks and Mitigations

- **Risk**: Strong coupling between `transactions` and `wallet`.
- **Mitigation**: Use an interface in `shared/domain` so `transactions` can query the balance without knowing `wallet`'s implementation.

## Recommended Tools and Guides

- `Command` component from shadcn/ui for the contact selector.
