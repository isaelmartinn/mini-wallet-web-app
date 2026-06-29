# ADR 001: Hexagonal Architecture with Screaming Architecture and Domain-Driven Design

## Status

Accepted

## Context

When building a modern web application, especially one dealing with financial transactions and user wallets, several architectural forces come into play:

### Technical Forces

- **Complexity Management**: Financial applications require clear separation between business logic and technical infrastructure to ensure correctness and maintainability
- **Testing Requirements**: Critical business logic must be testable in isolation without dependencies on frameworks, databases, or external services
- **Technology Independence**: Business rules should not be coupled to specific frameworks (Next.js, React) or libraries, allowing for easier migration and updates
- **Framework Constraints**: Next.js App Router provides a specific routing structure that must coexist with domain-driven organization

### Business Forces

- **Domain Clarity**: The application deals with distinct business domains (authentication, wallet management, payment transfers, contacts) that need clear boundaries
- **Business Logic Integrity**: Financial operations require strict validation rules, error handling, and state management that must be enforced at the domain level
- **Scalability of Team**: The codebase must support multiple developers working on different features without stepping on each other's toes
- **Regulatory Compliance**: Financial applications may need to demonstrate clear audit trails and business rule enforcement

### Project Forces

- **Pure Client-Side Rendering**: The application is an authenticated SPA with no SEO requirements, eliminating the need for server-side rendering
- **Rapid Development**: Need for clear patterns and conventions that accelerate feature development
- **Code Quality**: Requirement for automated enforcement of architectural boundaries through linting and testing
- **Maintainability**: Future developers must be able to understand architectural decisions and business logic organization

### Architectural Tensions

1. **Framework vs. Domain**: Next.js encourages file-system based routing (`/app` folder), but business logic should be organized by domain, not by routes
2. **Coupling vs. Convenience**: Direct imports between domains are convenient but create tight coupling that hinders independent evolution
3. **Purity vs. Pragmatism**: Pure hexagonal architecture can be verbose; need to balance theoretical purity with practical development speed
4. **Testing vs. Speed**: Comprehensive testing requires more upfront structure but pays dividends in confidence and refactoring ability

## Decision

We will implement a **Hexagonal Architecture** (Ports and Adapters) combined with **Domain-Driven Design (DDD)** principles and **Screaming Architecture** for folder organization.

### Core Architectural Decisions

#### 1. Hexagonal Architecture (Ports and Adapters)

We will organize code into three distinct layers with strict dependency rules:

**Domain Layer (Core)**

- Contains pure business logic: Entities, Value Objects, Domain Services
- Has zero dependencies on external frameworks or libraries
- Defines repository interfaces (ports) but not implementations
- Enforces business rules through encapsulation and validation

**Application Layer (Use Cases)**

- Orchestrates domain objects to fulfill specific use cases
- Depends only on the Domain Layer
- Defines the application's API through use case interfaces
- Coordinates transactions and cross-cutting concerns

**Infrastructure Layer (Adapters)**

- Implements technical details: UI (React components), repositories, HTTP clients, state management
- Depends on both Domain and Application layers
- Adapts external frameworks to domain interfaces
- Contains all framework-specific code (Next.js, React, Zustand, Chakra UI)

**Dependency Rule**: Dependencies point inward only. Domain knows nothing about Application or Infrastructure. Application knows Domain but not Infrastructure. Infrastructure knows both.

#### 2. Domain-Driven Design (DDD)

We will organize code by business domains (bounded contexts), not by technical layers:

**Identified Domains**:

- `auth/session`: Authentication and session management
- `wallet/balance`: Balance management and display
- `wallet/user-profile`: User profile information
- `payments/transfer`: Money transfer operations
- `payments/contact`: Contact management for transfers

**Domain Isolation**: Each domain is self-contained with its own domain, application, and infrastructure layers. Domains communicate through interfaces defined in the shared layer, never through direct imports.

#### 3. Screaming Architecture

We will use a folder structure that "screams" the business purpose of the application:

```
/src/contexts/{domain}/{feature}/
├── domain/           # Business logic
├── application/      # Use cases
└── infrastructure/   # Technical details
```

This structure makes the business domains immediately visible when opening the project, rather than hiding them behind technical layers like `/controllers`, `/services`, `/models`.

#### 4. Separation of Next.js Routes from Domain Logic

The `/app` folder (Next.js App Router) is treated as part of the infrastructure layer:

- Route files (`page.tsx`) are thin adapters that import and render domain pages
- All business logic and UI components live in `/src/contexts/{domain}/infrastructure/ui`
- This separation allows the domain to be framework-agnostic

#### 5. Strict Boundary Enforcement

We will use `eslint-plugin-boundaries` to automatically enforce:

- Layer dependency rules (Domain → Application → Infrastructure)
- Domain isolation (no cross-domain imports)
- Violations fail the build, preventing architectural erosion

#### 6. Pure Client-Side Rendering

We will use pure CSR (Client-Side Rendering) by adding `"use client"` to all Next.js route files:

- Simplifies mental model (no hydration complexity)
- Appropriate for authenticated applications without SEO needs
- Allows aggressive code splitting and lazy loading
- All data fetching happens client-side through use cases

### Implementation Patterns

**Mandatory Interfaces**: All entities, use cases, services, and repositories must have TypeScript interfaces, enabling dependency inversion and easy mocking for tests.

**Value Objects**: Immutable objects with validation in constructors, used for domain concepts like amounts, dates, status values.

**Repository Pattern**: Domain defines repository interfaces; infrastructure provides implementations (currently mocked, easily swappable for real APIs).

**Use Case Pattern**: Each user action maps to one use case class with a single `execute()` method.

**Atomic Design for UI**: Infrastructure UI components organized as atoms, molecules, organisms, templates, and pages.

**Path Aliases**: Mandatory use of path aliases (`#auth/*`, `#wallet/*`, `#payments/*`, `#shared/*`) to avoid relative imports and make refactoring easier.

**Barrel Exports**: Each module exports its public API through `index.ts` files with explicit exports (no `export *`), providing controlled API surfaces.

## Consequences

### Positive Consequences

1. **Clear Business Logic Separation**: Domain logic is pure TypeScript with no framework dependencies, making it easy to understand, test, and reason about
2. **Testability**: Domain and application layers can be tested in isolation with simple unit tests; infrastructure can be tested with integration tests
3. **Framework Independence**: Could migrate from Next.js to another framework by only changing the infrastructure layer
4. **Team Scalability**: Multiple developers can work on different domains without conflicts; clear boundaries reduce coordination overhead
5. **Onboarding**: New developers can understand the business domains by looking at folder structure; architectural patterns are consistent across features
6. **Refactoring Confidence**: Strict boundaries and comprehensive tests make refactoring safer; automated linting catches violations early
7. **Business Logic Visibility**: Screaming architecture makes business capabilities immediately apparent; stakeholders can navigate the codebase
8. **Maintainability**: Clear separation of concerns makes it easier to locate and modify code; changes are localized to specific layers

### Negative Consequences

1. **Initial Complexity**: More folders and files than a simple layered architecture; steeper learning curve for developers unfamiliar with DDD/Hexagonal
2. **Boilerplate**: Requires interfaces, use cases, and repository abstractions even for simple operations; more code to write upfront
3. **Over-Engineering Risk**: For very simple features, the full hexagonal structure may feel like overkill
4. **Folder Navigation**: Deeper folder nesting requires more clicks to navigate; path aliases help but don't eliminate this entirely
5. **Coordination Overhead**: Cross-domain features require careful interface design; can't just import directly from another domain
6. **Build Tool Configuration**: Requires proper TypeScript path aliases, ESLint boundary rules, and test configuration
7. **Discipline Required**: Architecture only works if team consistently follows patterns; requires code review vigilance

### Neutral Consequences

1. **File Count**: More files due to separation of interfaces, implementations, and tests; modern IDEs handle this well
2. **Learning Curve**: Team must learn DDD concepts, hexagonal architecture, and project conventions; investment pays off over time
3. **Tooling Dependency**: Relies on ESLint plugins for enforcement; must maintain these configurations
4. **Testing Strategy**: Requires different testing approaches for different layers (unit vs integration vs E2E)

### Mitigations for Negative Consequences

- **Documentation**: Comprehensive `DECISIONS.md` and `AI_INSTRUCTIONS.md` files document all patterns and conventions
- **Code Generation**: Could create CLI tools or snippets to generate boilerplate for new features
- **Pragmatic Application**: For truly simple features, can use simplified structure while maintaining layer separation
- **Path Aliases**: TypeScript path aliases (`#auth/*`, etc.) make deep imports concise and refactorable
- **Automated Enforcement**: ESLint boundaries plugin catches violations automatically, reducing review burden
- **BDD Testing**: Given-When-Then test structure provides consistent, readable tests across all layers

### Impact on Future Decisions

1. **Technology Choices**: Future technology decisions must respect the hexagonal boundaries (e.g., new state management must be in infrastructure)
2. **Feature Development**: New features must follow the established domain structure and layer separation
3. **API Integration**: When moving from mocks to real APIs, only infrastructure layer changes; domain and application remain untouched
4. **Team Growth**: New team members must be trained in DDD and hexagonal architecture principles
5. **Refactoring**: Major refactorings should maintain the architectural boundaries; layer violations should be addressed immediately
6. **Testing Strategy**: All new code must include appropriate tests for its layer (unit for domain/application, integration for infrastructure)

## References

- **Hexagonal Architecture**: Alistair Cockburn's Ports and Adapters pattern
- **Domain-Driven Design**: Eric Evans' strategic and tactical patterns
- **Screaming Architecture**: Robert C. Martin's concept of architecture that reveals intent
- **Clean Architecture**: Robert C. Martin's concentric layer model
- **Project Documentation**: See `DECISIONS.md` for detailed implementation guidelines
