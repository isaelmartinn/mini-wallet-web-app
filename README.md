# Mini Wallet Web App

Digital wallet web application built with Next.js that allows managing contacts, making transfers, and viewing transaction history.

🚀 **<a href="https://mini-wallet-web-app.vercel.app/login" target="_blank">View live demo</a>**

## How to run the project

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Libraries used

### Framework and UI

- **Next.js 16** - React framework for web applications
- **React 19** - UI library
- **Chakra UI** - Component system
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icons
- **Sileo** - Physics-based toast notification component

### State management and forms

- **Zustand** - Global state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Testing

- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Testing Library** - Testing utilities

### Code quality

- **ESLint** - Linter
- **Prettier** - Code formatter
- **Husky** - Git hooks
- **TypeScript** - Static typing

## Architecture

The project follows a **hexagonal architecture** (also known as ports and adapters architecture) combined with **Domain-Driven Design (DDD)** and **Screaming Architecture** principles. The UI layer implements **Atomic Design** methodology for component organization.

### Architectural approaches

- **Hexagonal Architecture**: Separates business logic from implementation details through ports and adapters
- **Domain-Driven Design (DDD)**: Focuses on modeling the business domain with entities, value objects, and use cases
- **Screaming Architecture**: The folder structure clearly communicates the business purpose and domain concepts
- **Atomic Design**: UI components are organized hierarchically (atoms, molecules, organisms, templates, pages)

### Architectural principles

- **Separation of concerns**: Domain logic is isolated from infrastructure and presentation
- **Dependency inversion**: Outer layers depend on inner layers, never the other way around
- **Framework independence**: Business logic does not depend on Next.js, React, or any specific framework
- **Testability**: The architecture facilitates testing by allowing dependency injection and adapter mocking

### Main layers

- **Domain**: Contains entities, value objects, use cases, and business rules
- **Infrastructure**: Concrete implementations of repositories, external services, and APIs
- **Presentation**: React components organized using Atomic Design, pages, and UI contexts

### Applied patterns

- **Repository Pattern**: Data access abstraction
- **Context API**: Shared state management in the presentation layer
- **Dependency Injection**: Dependency injection to decouple components
- **Atomic Design**: Component hierarchy for scalable UI architecture
