# Implementation Plan 3: Transactions - Part 1 (Movements and History)

## Context and Objective
Implement the visualization of the recent movements list on the Home screen. This allows the user to see their historical financial activity.

## Architecture and Design
- **Domain**: `transactions`
- **Entities**: `Transaction`
- **Value Objects**: `TransactionStatus`, `TransactionType` (Credit/Debit), `TransactionDate`
- **Use Cases**: `GetTransactionsUseCase`
- **Infrastructure**: `TransactionRepository` (Mock), `MovementsList` (Component)

## General Implementation Rules (Applicable to all plans)
- **Language**: Code, variable names, functions, classes, internal documentation and comments **ALWAYS** in English.
- **UI**: Text visible to the end user **ALWAYS** in Spanish.
- **Components**: Do not create custom components if a `shadcn/ui` alternative exists. **ALWAYS** check the library before implementing. Only create components if the logic is very business-specific or does not exist in the library.

## Implementation Steps

### 1. Domain Layer
- Implement `Transaction` entity (id, amount, type, status, date, description/recipient).
- Define VOs for `TransactionStatus` (PENDING, SUCCESS, FAILED) and types.

### 2. Application Layer
- Implement `GetTransactionsUseCase`: Retrieves the transaction list for the user.

### 3. Infrastructure Layer (Persistence and Simulation)
- Implement `TransactionRepository` with a set of initial mocked data (minimum 5 movements with different states and dates).
- **Error Simulation**: Implement probability logic for movement retrieval:
    - Success: 85% (Configurable via environment variable or constant).
    - Error: 15% (Configurable).
    - Logic must be easily modifiable through a percentage configuration object.

### 4. Infrastructure Layer (UI)
- Create `MovementItem` component: Individual representation of a transaction.
- Create `MovementsList` component: List grouped by dates (optional) or simple.
- Integrate `MovementsList` into the `HomePage`.
- Handle "Empty List" and "Loading Error" states.

## Acceptance Criteria
- List shows movements ordered by date (most recent first).
- Each item shows indicative icon (money in or out), description, date, and amount.
- Negative amounts (outputs) are visually distinguished from positive ones (inputs).

## Test Plan
- **Unit (Domain)**: Test `Transaction` creation and field validations.
- **Unit (Application)**: Test `GetTransactionsUseCase` with mocked data.
- **Components**: Test `MovementItem` verifying colors and formats according to transaction type.
- **E2E**: Verify that the movements list is correctly displayed in Home after login.

## Risks and Mitigations
- **Risk**: Performance with long lists.
- **Mitigation**: Implement infinite scroll or simple pagination in the mock repository.

## Recommended Tools and Guides
- `date-fns` for date handling and formatting.
