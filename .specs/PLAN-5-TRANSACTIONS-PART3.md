# Implementation Plan 5: Transactions - Part 3 (Confirmation and Receipt)

> **⚠️ CRITICAL PREREQUISITE**: Before starting any development work on this plan, you **MUST** read and fully understand the `AI_INSTRUCTIONS.md` file at the root of the project. Development cannot proceed without comprehending this file.

## Context and Objective

Finalize the transaction flow with the final confirmation, handling random success and error scenarios (network, insufficient funds, timeout) and showing the corresponding receipt.

## Architecture and Design

- **Domain**: `transactions`
- **Use Cases**: `ConfirmTransactionUseCase`
- **Infrastructure**: `ConfirmationPage`, `ReceiptCard` (Receipt)

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a `shadcn/ui` alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Application Layer

- Implement `ConfirmTransactionUseCase`:
  - Executes final confirmation.
  - **Scenario Configuration (Percentages)**: Implement randomness logic based on an easily modifiable configuration object:
    - `SUCCESS`: 60%
    - `NETWORK_ERROR`: 15%
    - `INSUFFICIENT_FUNDS`: 10%
    - `TIMEOUT`: 10%
    - `UNKNOWN_ERROR`: 5%
  - If successful, triggers balance update in `wallet` domain (via event or shared service).

### 2. Infrastructure Layer (UI - Confirmation States)

- Implement `ConfirmationPage` in `src/contexts/transactions/infrastructure/ui/pages`.
- Create visual states for:
  - Processing (Loading spinner with dynamic message).
  - Success (Animated checkmark).
  - Error with description and "Retry" or "Back to Home" button.

### 3. Infrastructure Layer (UI - Receipt)

- Create `ReceiptCard` component:
  - Shows transaction ID, date, amount, recipient, and status.
  - Option to "Download" (mocked) or "Share" (mocked).

### 4. Route and Navigation

- Configure `/transactions/confirm` route in `app/(dashboard)/transactions/confirm/page.tsx`.
- Ensure this route cannot be accessed without previous data from an ongoing transaction.

## Acceptance Criteria

- Confirmation screen handles all defined scenarios (Success, Network error, Insufficient funds, Timeout, Unknown error).
- In case of success, the user's balance on Home reflects the corresponding discount.
- "Retry" button on network errors triggers the process again.

## Test Plan

- **Unit (Application)**: Test `ConfirmTransactionUseCase` forcing each random scenario to validate the response.
- **Components**: Test `ReceiptCard` verifying it shows correct transaction information.
- **E2E**:
  - Full successful flow: Login -> New Transaction -> Confirm -> View Receipt -> Back to Home and see new balance.
  - Error flow: Simulate network failure and verify retry option.

## Risks and Mitigations

- **Risk**: Randomness can make E2E tests unstable (flaky).
- **Mitigation**: Use environment variables or URL parameters to "force" a specific result during automated tests.

## Recommended Tools and Guides

- `Framer Motion` for state animations (optional but recommended for the success checkmark).
