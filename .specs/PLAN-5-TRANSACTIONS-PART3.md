# Implementation Plan 5: Transactions - Part 3 (Confirmation and Receipt)

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

Finalize the transfer flow with the final confirmation, handling random success and error scenarios (network, insufficient funds, timeout) and showing the corresponding receipt.

## Architecture and Design

- **Context**: `payments`
- **Sub-domain**: `transfer`
- **Use Cases**: `ConfirmTransferUseCase`
- **Infrastructure**: `ConfirmationPage`, `ReceiptCard` (Receipt)

## General Implementation Rules (Applicable to all plans)

- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a Chakra UI alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Application Layer

- Implement `ConfirmTransferUseCase` in `src/contexts/payments/transfer/application/use-cases/`:
  - Executes final transfer confirmation.
  - **Scenario Configuration (Percentages)**: Implement randomness logic based on an easily modifiable configuration object:
    - `SUCCESS`: 60%
    - `NETWORK_ERROR`: 15%
    - `INSUFFICIENT_FUNDS`: 10%
    - `TIMEOUT`: 10%
    - `UNKNOWN_ERROR`: 5%
  - If successful, triggers balance update in `wallet` domain (via event or shared service).

### 2. Infrastructure Layer (UI - Confirmation States)

- Implement `ConfirmationPage` in `src/contexts/payments/transfer/infrastructure/ui/pages/`.
- Create visual states for:
  - Processing (Loading spinner with dynamic message).
  - Success (Animated checkmark).
  - Error with description and "Retry" or "Back to Home" button.

### 3. Infrastructure Layer (UI - Receipt)

- Create `ReceiptCard` component in `src/contexts/payments/transfer/infrastructure/ui/components/`:
  - Shows transfer ID, date, amount, recipient, and status.
  - Option to "Download" (mocked) or "Share" (mocked).

### 4. Route and Navigation

- Configure `/transactions/confirm` route in `app/(dashboard)/transactions/confirm/page.tsx`.
- Ensure this route cannot be accessed without previous data from an ongoing transfer.

## Acceptance Criteria

- Confirmation screen handles all defined scenarios (Success, Network error, Insufficient funds, Timeout, Unknown error).
- In case of success, the user's balance on Home reflects the corresponding discount.
- "Retry" button on network errors triggers the process again.

## Test Plan

- **Unit (Application)**: Test `ConfirmTransferUseCase` forcing each random scenario to validate the response.
- **Components**: Test `ReceiptCard` verifying it shows correct transfer information.
- **E2E**:
  - Full successful flow: Login -> New Transfer -> Confirm -> View Receipt -> Back to Home and see new balance.
  - Error flow: Simulate network failure and verify retry option.

## Risks and Mitigations

- **Risk**: Randomness can make E2E tests unstable (flaky).
- **Mitigation**: Use environment variables or URL parameters to "force" a specific result during automated tests.

## Recommended Tools and Guides

- `Framer Motion` for state animations (optional but recommended for the success checkmark).
