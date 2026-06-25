# Decisiones de Arquitectura - Mini Wallet Web App

## Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Dominios (DDD)](#dominios-ddd)
5. [Reglas de Dependencias](#reglas-de-dependencias)
6. [Patrones y Convenciones](#patrones-y-convenciones)
7. [Testing](#testing)
8. [Configuración de Herramientas](#configuración-de-herramientas)

---

## Stack Tecnológico

### Framework y Lenguaje
- **Next.js** con **App Router** (carpeta `app/`)
- **TypeScript** estricto (no `any`, no inline types)
- **React 18+**

### Rendering Strategy
- **CSR (Client-Side Rendering)** puro
- **Justificación**: Aplicación autenticada sin contenido público, no requiere SEO. Todo el contenido es dinámico y personalizado por usuario. CSR simplifica el modelo mental, evita complejidad de hidratación, y permite optimizar con code splitting y lazy loading.

### Estado Global
- **Zustand** para manejo de estado global
- Store por dominio cuando sea necesario

### UI y Estilos
- **shadcn/ui** como librería de componentes base
- **Tailwind CSS** para estilos (solo clases, no inline CSS)
- **PostCSS** configurado para optimizar y limpiar clases generadas
- **Atomic Design** para organización de componentes en infraestructura

### Testing
- **Vitest** con **React Testing Library** para pruebas unitarias e integración
- **Playwright** para pruebas E2E
- **BDD** (Given, When, Then) para estructura de tests

### Calidad de Código
- **ESLint** con configuración estricta
- **Prettier** para formateo
- **Husky** para pre-commit hooks
- **eslint-plugin-boundaries** para enforcar reglas de DDD

---

## Arquitectura General

### Principios Arquitectónicos

1. **Domain-Driven Design (DDD)**: Separación por dominios de negocio
2. **Hexagonal Architecture**: Separación entre dominio, aplicación e infraestructura
3. **Screaming Architecture**: La estructura de carpetas grita el propósito del negocio
4. **Atomic Design**: Para organización de componentes UI en la capa de infraestructura

### Capas de la Arquitectura Hexagonal

```
┌─────────────────────────────────────────────┐
│         INFRASTRUCTURE LAYER                │
│  (UI, API, Repositories, External Services) │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      APPLICATION LAYER                │ │
│  │    (Use Cases, Orchestration)         │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │      DOMAIN LAYER               │ │ │
│  │  │  (Entities, VOs, Services,      │ │ │
│  │  │   Business Rules)               │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Domain Layer (Núcleo)
- **Entities**: Objetos con identidad y ciclo de vida
- **Value Objects (VO)**: Objetos inmutables sin identidad
- **Domain Services**: Lógica de negocio que no pertenece a una entidad
- **Errors**: Errores de dominio específicos
- **No dependencias externas**: Solo lógica de negocio pura

#### Application Layer (Casos de Uso)
- **Use Cases**: Orquestación de lógica de negocio
- Puede depender de: Domain Layer
- No puede depender de: Infrastructure Layer

#### Infrastructure Layer (Adaptadores)
- **UI**: Componentes React (Atomic Design), páginas
- **Repositories**: Implementaciones de persistencia
- **API**: Clientes HTTP, API routes
- Puede depender de: Domain y Application Layers

---

## Estructura de Carpetas

### Estructura Raíz

```
/
├── .devin/
│   └── workflows/
├── .specs/
├── app/                    # Next.js App Router
├── e2e/                    # Pruebas End-to-End
├── public/
├── src/
│   ├── contexts/           # Dominios (DDD)
│   └── shared/             # Código compartido entre dominios
├── .eslintrc.json
├── .prettierrc
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Estructura de un Dominio (Contexto)

**Regla fundamental**: Todo debe estar agrupado en carpetas, nunca archivos sueltos en la raíz de una carpeta.

```
/src/contexts/{domain}/
├── application/
│   └── use-cases/
│       ├── {use-case-name}/
│       │   ├── {useCaseName}.useCase.ts
│       │   ├── {useCaseName}.interface.ts
│       │   └── {useCaseName}.useCase.spec.ts
│       └── index.ts        # Barrel export
├── domain/
│   ├── entities/
│   │   ├── {entity-name}/
│   │   │   ├── {entityName}.entity.ts
│   │   │   ├── {entityName}.interface.ts
│   │   │   └── {entityName}.entity.spec.ts
│   │   └── index.ts
│   ├── value-objects/
│   │   ├── {vo-name}/
│   │   │   ├── {vo-name}.vo.ts
│   │   │   └── {vo-name}.vo.spec.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── {service-name}/
│   │   │   ├── {service-name}.service.ts
│   │   │   └── {service-name}.service.spec.ts
│   │   └── index.ts
│   ├── errors/
│   │   ├── {error-name}/
│   │   │   └── {error-name}.error.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   ├── pages/
│   │   │   └── {page-name}/
│   │   │       ├── {page-name}.page.tsx
│   │   │       └── {page-name}.page.spec.tsx
│   │   └── index.ts
│   ├── repositories/
│   │   ├── {repository-name}/
│   │   │   ├── {repository-name}.repository.ts
│   │   │   ├── {repository-name}.repository.mock.ts
│   │   │   └── {repository-name}.repository.spec.ts
│   │   └── index.ts
│   ├── api/
│   │   ├── {api-name}/
│   │   │   └── {api-name}.api.ts
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

### Estructura de Pruebas E2E

```
/e2e/
├── flows/
│   ├── login.spec.ts
│   ├── transaction-flow.spec.ts
│   └── home-navigation.spec.ts
├── fixtures/
│   ├── users.fixture.ts
│   ├── transactions.fixture.ts
│   └── contacts.fixture.ts
├── page-objects/
│   ├── login.page.ts
│   ├── home.page.ts
│   └── transaction.page.ts
└── playwright.config.ts
```

**Justificación**: Las pruebas E2E prueban flujos completos que atraviesan múltiples dominios. No pertenecen a ningún dominio específico, por lo que viven en la raíz del proyecto.

**Fixtures**: Datos de prueba reutilizables (usuarios mock, transacciones, etc.) que se usan en múltiples tests.

**Page Objects**: Patrón para encapsular la lógica de interacción con páginas, evitando repetir selectores y acciones en cada test.

### Carpeta Shared

```
/src/shared/
├── ui/
│   ├── components/         # Wrappers de shadcn/ui
│   ├── hooks/
│   └── utils/
├── domain/
│   ├── value-objects/      # VOs compartidos entre dominios
│   ├── errors/             # DomainError base y errores compartidos
│   └── interfaces/         # Interfaces compartidas entre dominios
├── infrastructure/
│   ├── store/              # Zustand stores
│   ├── http/               # Cliente HTTP base
│   └── utils/
└── index.ts
```

---

## Dominios (DDD)

### Dominios Identificados

#### 1. `auth` (Identity & Access)
**Responsabilidad**: Autenticación y gestión de sesión

**Entidades**:
- `User` (usuario autenticado)

**Value Objects**:
- `Email`
- `Phone`

**Use Cases**:
- `LoginUseCase`
- `LogoutUseCase`
- `ValidateSessionUseCase`

**Reglas de Negocio**:
- Validación de formato de email/teléfono
- Persistencia de sesión mockeada
- Manejo de estados de autenticación

---

#### 2. `wallet` (Core Domain)
**Responsabilidad**: Gestión de saldo y perfil de usuario

**Entidades**:
- `Balance` (saldo disponible)
- `UserProfile` (nombre, info básica)

**Value Objects**:
- `Amount` (monto con validaciones)

**Use Cases**:
- `GetBalanceUseCase`
- `GetUserProfileUseCase`

**Reglas de Negocio**:
- Saldo siempre >= 0
- Formato de montos (decimales, moneda)

---

#### 3. `transactions` (Transacciones)
**Responsabilidad**: Creación, validación y listado de transacciones

**Entidades**:
- `Transaction` (transacción con estado)
- `Contact` (destinatario/contacto)

**Value Objects**:
- `Amount` (compartido con wallet)
- `TransactionStatus` (pending, success, failed)

**Domain Services**:
- `TransactionValidationService` (validaciones de negocio)

**Use Cases**:
- `CreateTransactionUseCase`
- `ConfirmTransactionUseCase`
- `GetTransactionsUseCase`
- `AddContactUseCase`
- `GetContactsUseCase`

**Reglas de Negocio**:
- Monto mínimo > 0
- Saldo suficiente (consulta a wallet)
- Destinatario obligatorio
- Estados de transacción (éxito, error, timeout)

---

### Relación entre Dominios

```
┌──────────┐
│   auth   │
└────┬─────┘
     │ proporciona sesión
     ▼
┌──────────┐      consulta saldo      ┌──────────────┐
│  wallet  │◄────────────────────────│ transactions │
└──────────┘                          └──────────────┘
```

**Nota**: `transactions` puede consultar `wallet` para validar saldo, pero no debe tener dependencia directa. Se debe usar una interfaz o evento.

---

## Reglas de Dependencias

### Reglas de Capas (Hexagonal)

1. **Domain** no puede importar de **Application** ni **Infrastructure**
2. **Application** puede importar de **Domain**, pero NO de **Infrastructure**
3. **Infrastructure** puede importar de **Domain** y **Application**

### Reglas de Dominios (DDD)

4. Un dominio **NO** puede importar directamente de otro dominio
5. Si se necesita comunicación entre dominios, usar:
   - Interfaces en `shared/domain`
   - Eventos de dominio
   - Inyección de dependencias en Application Layer

### Enforcement con ESLint

Se debe usar **`eslint-plugin-boundaries`** para enforcar estas reglas automáticamente.

**Configuración esperada**:
- Definir boundaries por capa (domain, application, infrastructure)
- Definir boundaries por dominio (auth, wallet, transactions)
- Configurar reglas de dependencias permitidas
- Fallar en lint si se viola alguna regla

**Ejemplo de violación**:
```typescript
// ❌ INCORRECTO - Domain importando de Infrastructure
// src/contexts/auth/domain/entities/user/user.entity.ts
import { api } from "#auth/infrastructure/api";  // ❌ Violación

// ❌ INCORRECTO - Un dominio importando de otro
// src/contexts/transactions/domain/services/validation.service.ts
import { Balance } from "#wallet/domain/entities";  // ❌ Violación

// ✅ CORRECTO - Usar shared o interfaces
import { BalanceProvider } from "#shared/domain/interfaces";
```

---

## Patrones y Convenciones

### Naming Conventions

#### Archivos
- **Entities**: `{name}.entity.ts`
- **Value Objects**: `{name}.vo.ts`
- **Services**: `{name}.service.ts`
- **Use Cases**: `{name}.useCase.ts` (camelCase)
- **Repositories**: `{name}.repository.ts`
- **Components**: `{name}.tsx`
- **Tests**: `{name}.spec.ts` o `{name}.spec.tsx`
- **Interfaces**: `{name}.interface.ts`

#### Carpetas
- **kebab-case**: `transaction-validation/`
- Siempre agrupadas, nunca archivos sueltos en raíz

#### Barrels (index.ts)
- Cada subcarpeta debe tener su barrel en la raíz
- Ejemplo: `/domain/entities/index.ts` exporta todas las entidades
- Permite imports limpios: `import { User } from "#auth/domain/entities"`

### Alias de Imports

**Configuración en `tsconfig.json`**:
```json
{
  "compilerOptions": {
    "paths": {
      "#auth/*": ["src/contexts/auth/*"],
      "#wallet/*": ["src/contexts/wallet/*"],
      "#transactions/*": ["src/contexts/transactions/*"],
      "#shared/*": ["src/shared/*"],
      "@/app/*": ["app/*"]
    }
  }
}
```

**Uso**:
```typescript
import { LoginUseCase } from "#auth/application/use-cases";
import { Amount } from "#shared/domain/value-objects";
import { Button } from "#shared/ui/components";
```

### Code Style

- **Comillas dobles** siempre: `"string"`
- **Indentación**: 2 espacios
- **Salto de línea al final** de cada archivo
- **No `any`**: Usar `unknown` si es necesario, luego type guard
- **No inline types**: Siempre definir tipos/interfaces en archivos separados o al inicio del archivo
- **Tailwind classes**: Solo clases de Tailwind, no inline CSS (`style={{}}`)

### Uso Obligatorio de Interfaces

**Regla fundamental**: Todas las entidades, use cases, servicios y repositorios **DEBEN** tener una interfaz.

**Razones**:
1. **Inversión de dependencias**: Permite inyectar implementaciones mock en tests
2. **Contratos claros**: Define explícitamente el comportamiento esperado
3. **Flexibilidad**: Facilita cambiar implementaciones sin afectar consumidores
4. **Testing**: Permite crear mocks fácilmente

**Estructura obligatoria**:
```
/entity-name/
  entityName.interface.ts    ← Interfaz (contrato)
  entityName.entity.ts       ← Implementación
  entityName.entity.spec.ts  ← Tests
```

**Naming convention**:
- Interfaces: `{name}.interface.ts` (sin prefijo `I`)
- Siempre en archivos separados con `.interface.ts` para claridad

### Value Objects (VO)

**Características**:
- Inmutables
- Sin identidad (igualdad por valor)
- Validaciones en el constructor
- Métodos de negocio si aplica

**Ejemplo estructural**:
```typescript
// src/contexts/wallet/domain/value-objects/amount/amount.interface.ts
export interface Amount {
  getValue(): number;
  isGreaterThan(other: Amount): boolean;
  add(other: Amount): Amount;
}

// src/contexts/wallet/domain/value-objects/amount/amount.vo.ts
import { Amount as AmountInterface } from "./amount.interface";

export class Amount implements AmountInterface {
  private constructor(private readonly value: number) {
    // Validaciones en constructor
  }

  static create(value: number): Amount {
    // Factory method con validaciones
  }

  getValue(): number {
    return this.value;
  }

  // Métodos de negocio
  isGreaterThan(other: AmountInterface): boolean { }
  add(other: AmountInterface): Amount { }
}
```

### Entities

**Características**:
- Tienen identidad (ID)
- Pueden mutar (pero controlado)
- Encapsulan lógica de negocio

**Ejemplo estructural**:
```typescript
// src/contexts/transactions/domain/entities/transaction/transaction.interface.ts
export interface Transaction {
  getId(): string;
  getStatus(): TransactionStatus;
  confirm(): void;
  fail(reason: string): void;
}

// src/contexts/transactions/domain/entities/transaction/transaction.entity.ts
import { Transaction as TransactionInterface } from "./transaction.interface";

export class Transaction implements TransactionInterface {
  private constructor(
    private readonly id: string,
    private status: TransactionStatus,
    // ...
  ) {}

  static create(params: CreateTransactionParams): Transaction { }

  getId(): string {
    return this.id;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  confirm(): void {
    // Lógica de negocio para confirmar
  }

  fail(reason: string): void {
    // Lógica de negocio para fallar
  }
}
```

### Domain Services

**Cuándo usar**:
- Lógica de negocio que involucra múltiples entidades
- Validaciones complejas que no pertenecen a una entidad específica

**Ejemplo estructural**:
```typescript
// src/contexts/transactions/domain/services/transaction-validation/transaction-validation.service.ts
export class TransactionValidationService {
  validateTransaction(
    transaction: Transaction,
    balance: Balance
  ): ValidationResult {
    // Lógica de validación compleja
  }
}
```

### Use Cases

**Características**:
- Orquestan la lógica de negocio
- Un caso de uso = una acción del usuario
- Pueden depender de repositorios (inyectados)

**Ejemplo estructural**:
```typescript
// src/contexts/transactions/application/use-cases/create-transaction/createTransaction.interface.ts
export interface CreateTransactionUseCase {
  execute(params: CreateTransactionParams): Promise<Transaction>;
}

// src/contexts/transactions/application/use-cases/create-transaction/createTransaction.useCase.ts
import { CreateTransactionUseCase as CreateTransactionUseCaseInterface } from "./createTransaction.interface";

export class CreateTransactionUseCase implements CreateTransactionUseCaseInterface {
  constructor(
    private transactionRepository: TransactionRepository,
    private balanceRepository: BalanceRepository
  ) {}

  async execute(params: CreateTransactionParams): Promise<Transaction> {
    // 1. Validar
    // 2. Crear entidad
    // 3. Persistir
    // 4. Retornar
  }
}
```

### Repositories

**Características**:
- Interfaz en Domain o Application
- Implementación en Infrastructure
- Mock para testing

**Ejemplo estructural**:
```typescript
// src/contexts/transactions/domain/repositories/transaction.repository.interface.ts
export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findAll(): Promise<Transaction[]>;
}

// src/contexts/transactions/infrastructure/repositories/transaction-repository/transaction.repository.ts
import { TransactionRepository as TransactionRepositoryInterface } from "#transactions/domain/repositories";

export class TransactionRepository implements TransactionRepositoryInterface {
  // Implementación real (mock en este caso)
}

// src/contexts/transactions/infrastructure/repositories/transaction-repository/transaction.repository.mock.ts
import { TransactionRepository as TransactionRepositoryInterface } from "#transactions/domain/repositories";

export class TransactionRepositoryMock implements TransactionRepositoryInterface {
  // Implementación para tests
}
```

---

## Testing

### Estrategia de Testing

1. **Pruebas Unitarias**: Domain (entities, VOs, services) y Application (use cases)
2. **Pruebas de Integración**: Infrastructure (repositories, API clients)
3. **Pruebas de Componentes**: UI components
4. **Pruebas E2E**: Flujos completos de usuario

### Ubicación de Tests

**Regla fundamental**: Los tests deben estar **junto** al archivo que prueban, **NO** en carpeta `__tests__`.

```
/use-cases/
  /create-transaction/
    createTransaction.useCase.ts
    createTransaction.interface.ts
    createTransaction.useCase.spec.ts    ← Junto al archivo
```

### Estructura de Tests (BDD)

Todos los tests deben seguir el patrón **Given-When-Then** con `describe` anidados:

```typescript
describe("CreateTransactionUseCase", () => {
  describe("Given a user with sufficient balance", () => {
    describe("When creating a transaction", () => {
      it("Then should create transaction successfully", () => {
        const balance = Balance.create(1000);
        const params = { amount: 500, recipient: "..." };

        const result = useCase.execute(params);

        expect(result.isSuccess()).toBe(true);
      });
    });
  });

  describe("Given a user with insufficient balance", () => {
    describe("When creating a transaction", () => {
      it("Then should fail with InsufficientFundsError", () => {
        const balance = Balance.create(100);
        const params = { amount: 500, recipient: "..." };

        const result = useCase.execute(params);

        expect(result.isFailure()).toBe(true);
        expect(result.error).toBeInstanceOf(InsufficientFundsError);
      });
    });
  });
});
```

**Estructura obligatoria**:
- **Primer nivel**: `describe("NombreDelSUT")` (System Under Test)
- **Segundo nivel**: `describe("Given [contexto/precondición]")`
- **Tercer nivel**: `describe("When [acción]")`
- **Cuarto nivel**: `it("Then [resultado esperado]")`

Esta estructura aplica para **tests unitarios, de integración y E2E**.
```

### Testing con Vitest

- Usar `describe` para agrupar tests
- Usar `it` o `test` para casos individuales
- Usar `beforeEach` para setup común
- Mocks con `vi.fn()` y `vi.mock()`

### Testing de Componentes

```typescript
// src/contexts/auth/infrastructure/ui/pages/login-page/login-page.spec.tsx
describe("LoginPage", () => {
  it("should render login form", () => {
    // Given
    render(<LoginPage />);

    // Then
    expect(screen.getByLabelText("Phone or Email")).toBeInTheDocument();
  });

  it("should call login use case when form is submitted", async () => {
    // Given
    const mockLogin = vi.fn();
    render(<LoginPage onLogin={mockLogin} />);

    // When
    await userEvent.type(screen.getByLabelText("Phone or Email"), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then
    expect(mockLogin).toHaveBeenCalledWith("test@example.com");
  });
});
```

### Pruebas E2E con Playwright

**Fixtures**: Datos de prueba reutilizables
```typescript
// e2e/fixtures/users.fixture.ts
export const testUser = {
  phone: "+521234567890",
  name: "Juan Pérez",
  balance: 5000
};
```

**Page Objects**: Encapsular interacciones con páginas
```typescript
// e2e/page-objects/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(phone: string) {
    await this.page.fill('[data-testid="phone-input"]', phone);
    await this.page.click('[data-testid="login-button"]');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL("/home");
  }
}
```

**Flujos E2E**:
```typescript
// e2e/flows/transactionFlow.spec.ts
test.describe("Transaction Flow", () => {
  test.describe("Given an authenticated user with sufficient balance", () => {
    test.describe("When completing a transaction", () => {
      test("Then should show success confirmation", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testUser.phone);

        const homePage = new HomePage(page);
        await homePage.clickNewTransaction();

        const transactionPage = new TransactionPage(page);
        await transactionPage.fillAmount(100);
        await transactionPage.selectContact("María García");
        await transactionPage.confirm();

        await expect(page.getByText("Transaction successful")).toBeVisible();
      });
    });
  });
});
```

---

## Configuración de Herramientas

### Husky Pre-commit Hooks

En cada commit se debe verificar:
1. **Lint**: `eslint` sobre archivos modificados
2. **Format**: `prettier` sobre archivos modificados
3. **Tests**: Pruebas unitarias de archivos modificados

**Configuración esperada**:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ]
  }
}
```

### ESLint

**Plugins requeridos**:
- `@typescript-eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-boundaries` (para enforcar DDD)

**Reglas importantes**:
- No `any`
- No `console.log` en producción
- Imports ordenados
- Boundaries de DDD

### Prettier

**Configuración**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

### PostCSS y Tailwind

**PostCSS** debe estar configurado para:
- Purgar clases no usadas en producción
- Optimizar el bundle de CSS
- Minificar

**Tailwind** configurado con:
- Paths a todos los archivos que usan clases
- Tema personalizado si es necesario
- Plugins de shadcn/ui

---

## Flujo de Navegación (App Router)

### Ubicación de App Router en la Arquitectura

**Importante**: La carpeta `/app` de Next.js es parte de la **capa de infraestructura**, NO del dominio.

```
┌─────────────────────────────────────────────┐
│         INFRASTRUCTURE LAYER                │
│                                             │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │  /app       │─────▶│  /src/contexts  │  │
│  │  (Next.js   │      │  (Domain logic) │  │
│  │   Routes)   │      │                 │  │
│  └─────────────┘      └─────────────────┘  │
└─────────────────────────────────────────────┘
```

**Principio**: Las páginas de Next.js son **adaptadores** que:
1. Reciben requests HTTP
2. Invocan use cases del dominio
3. Retornan respuestas (HTML, JSON)

**Separación clara**:
- `/app`: Rutas y adaptadores de Next.js (infraestructura)
- `/src/contexts`: Lógica de negocio (dominio + aplicación)
- `/src/contexts/{domain}/infrastructure/ui`: Componentes de presentación

### Estructura de Rutas

```
/app/
├── (auth)/
│   └── login/
│       └── page.tsx           → /login
├── (dashboard)/
│   ├── home/
│   │   └── page.tsx           → /home
│   └── transactions/
│       ├── new/
│       │   └── page.tsx       → /transactions/new
│       └── confirm/
│           └── page.tsx       → /transactions/confirm
├── layout.tsx
└── page.tsx                   → / (redirect a /login o /home)
```

**Grupos de rutas** `(auth)` y `(dashboard)`:
- Permiten layouts diferentes sin afectar la URL
- `(auth)`: Sin navbar, centrado
- `(dashboard)`: Con navbar, sidebar si aplica

### Páginas y Componentes

**Páginas** (`app/*/page.tsx`):
- Son componentes de Next.js
- Deben ser delgadas, solo orquestación
- Importan componentes de `infrastructure/ui/pages`

**Componentes de página** (`infrastructure/ui/pages`):
- Contienen la lógica de presentación
- Usan hooks de use cases
- Componen componentes atómicos

**Ejemplo de separación**:
```typescript
// app/(dashboard)/home/page.tsx (INFRAESTRUCTURA - Adaptador Next.js)
import { HomePage } from "#wallet/infrastructure/ui/pages";

export default function HomeRoute() {
  return <HomePage />;
}

// src/contexts/wallet/infrastructure/ui/pages/home-page/homePage.tsx (INFRAESTRUCTURA - UI)
export function HomePage() {
  // Lógica de presentación, hooks, etc.
  // Invoca use cases del dominio
}

// src/contexts/wallet/application/use-cases/get-balance/getBalance.useCase.ts (APLICACIÓN)
import { GetBalanceUseCase as GetBalanceUseCaseInterface } from "./getBalance.interface";

export class GetBalanceUseCase implements GetBalanceUseCaseInterface {
  // Lógica de negocio
}
```

**Flujo de datos**:
1. Usuario accede a `/home` → Next.js enruta a `app/(dashboard)/home/page.tsx`
2. `page.tsx` renderiza `<HomePage />` del dominio
3. `<HomePage />` usa hooks que invocan use cases
4. Use cases ejecutan lógica de negocio y retornan datos
5. Componente renderiza la UI con los datos

---

## Manejo de Estado con Zustand

### Stores por Dominio

Cada dominio puede tener su store si necesita estado global:

```
/src/shared/infrastructure/store/
  /auth-store/
    auth.store.ts
  /wallet-store/
    wallet.store.ts
  /transactions-store/
    transactions.store.ts
```

### Principios

- **Minimal**: Solo estado que realmente necesita ser global
- **Derivado**: Usar selectors para estado derivado
- **Acciones**: Métodos en el store para mutar estado
- **Persistencia**: Usar middleware de Zustand para localStorage si aplica

**Ejemplo estructural**:
```typescript
// src/shared/infrastructure/store/auth-store/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## Manejo de Errores

### Errores de Dominio

Todos los errores de dominio deben extender de una clase base `DomainError`:

```typescript
// src/shared/domain/errors/domainError.ts
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

Cada dominio define sus propios errores extendiendo `DomainError`:

```typescript
// src/contexts/transactions/domain/errors/insufficient-funds/insufficientFunds.error.ts
import { DomainError } from "#shared/domain/errors";

export class InsufficientFundsError extends DomainError {
  constructor(
    public readonly required: number,
    public readonly available: number
  ) {
    super(
      `Insufficient funds: required ${required}, available ${available}`,
      "INSUFFICIENT_FUNDS"
    );
  }
}
```

### Manejo en Use Cases

Los use cases deben retornar un `Result<T, E>` o lanzar errores de dominio:

```typescript
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
```

### Manejo en UI

Los componentes deben manejar errores y mostrar mensajes apropiados:
- Errores de validación: Inline en formularios
- Errores de negocio: Toasts o modales
- Errores de red: Páginas de error o reintentos

---

## Reglas de Negocio (Transacciones)

### Validaciones Obligatorias

1. **Monto mínimo**: No se permite monto cero ni negativo
2. **Saldo suficiente**: El monto no puede superar el saldo disponible
3. **Destinatario obligatorio**: No se puede confirmar sin destinatario

### Implementación

Estas validaciones deben estar en:
- **Domain Layer**: `TransactionValidationService` o en la entidad `Transaction`
- **NO** solo en la UI (la UI puede validar para UX, pero no es la única validación)

### Escenarios de Confirmación

La confirmación debe manejar aleatoriamente:
- ✅ **Éxito**: Transacción confirmada
- ❌ **Error de red**: Mostrar error con opción de reintentar
- ❌ **Fondos insuficientes**: Error descriptivo
- ⏱️ **Timeout**: Manejar espera excesiva
- ❓ **Error desconocido**: Fallback genérico

**Implementación**: Mock en repository que retorna aleatoriamente estos estados.

---

## Datos Mockeados

### Estrategia de Mocking

- **Repositories**: Implementaciones mock con datos en memoria
- **API Routes**: Next.js API routes que retornan datos mockeados
- **Delays**: Simular latencia de red con `setTimeout`
- **Errores**: Retornar errores aleatoriamente para probar manejo

### Datos Iniciales

**Usuario mockeado**:
- Nombre: "Juan Pérez"
- Teléfono: "+521234567890"
- Email: "juan.perez@example.com"
- Saldo inicial: $5,000 MXN

**Transacciones mockeadas**:
- 5-10 transacciones históricas
- Mix de enviadas y recibidas
- Diferentes montos y fechas

**Contactos mockeados**:
- 3-5 contactos favoritos
- Nombres, teléfonos/emails

---

## Consideraciones de Escalabilidad

Aunque es una app mockeada, las decisiones de diseño consideran:

1. **Separación de concerns**: Facilita agregar nuevos dominios (inversiones, préstamos, etc.)
2. **Boundaries claras**: Permite escalar equipos (un equipo por dominio)
3. **Testing robusto**: Confianza para refactorizar y agregar features
4. **Code splitting**: Next.js automático por ruta, lazy loading manual si es necesario
5. **Optimistic UI**: Actualizar UI antes de confirmar en servidor (para mejor UX)

---

## Limitaciones Conocidas

1. **Sin backend real**: Todos los datos son mockeados en memoria
2. **Sin persistencia**: Recargar la página pierde el estado (a menos que se use localStorage)
3. **Sin autenticación real**: No hay JWT, OAuth, ni seguridad real
4. **Sin manejo de concurrencia**: No se consideran race conditions en transacciones
5. **Sin internacionalización**: Solo español

---

## Próximos Pasos (Fuera de Scope)

Con más tiempo, se consideraría:

1. **Backend real**: Conectar a API REST o GraphQL
2. **Autenticación real**: JWT, refresh tokens, OAuth
3. **Persistencia**: Base de datos real
4. **Optimistic updates**: Mejorar UX con actualizaciones optimistas
5. **Internacionalización**: i18n para múltiples idiomas
6. **Accesibilidad**: Auditoría completa de a11y
7. **Performance**: Análisis con Lighthouse, optimizaciones
8. **Monitoring**: Sentry, analytics, logs

---

## Resumen de Decisiones Clave

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| **Rendering** | CSR | App autenticada, sin SEO, contenido dinámico |
| **Navegación** | App Router | Estándar moderno de Next.js |
| **Estado** | Zustand | Simple, performante, sin boilerplate |
| **Testing E2E** | Playwright | Más moderno y rápido que Cypress |
| **Arquitectura** | DDD + Hexagonal | Escalabilidad, mantenibilidad, boundaries claras |
| **UI** | Atomic Design | Reutilización, consistencia, escalabilidad |
| **Componentes** | shadcn/ui | Componentes de calidad, customizables, no vendor lock-in |
| **Estilos** | Tailwind CSS | Productividad, consistencia, bundle pequeño |
| **Calidad** | ESLint + Prettier + Husky | Código consistente, errores tempranos |
| **DDD Enforcement** | eslint-plugin-boundaries | Enforcar reglas arquitectónicas automáticamente |

---

**Documento vivo**: Este archivo debe actualizarse conforme el proyecto evoluciona y se toman nuevas decisiones arquitectónicas.
