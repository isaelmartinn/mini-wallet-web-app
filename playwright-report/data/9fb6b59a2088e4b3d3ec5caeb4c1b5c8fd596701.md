# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/wallet.spec.ts >> Wallet Home Page >> Given an authenticated user >> When viewing the home page >> Then should allow toggling balance visibility
- Location: e2e/flows/wallet.spec.ts:25:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/home" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e3]:
        - generic [ref=e5]:
            - img [ref=e7]
            - generic [ref=e10]:
                - heading "Iniciar sesión" [level=2] [ref=e11]
                - paragraph [ref=e12]: Ingresa tu email o teléfono para continuar
        - generic [ref=e15]:
            - group [ref=e16]:
                - generic [ref=e17]: Email o Teléfono
                - textbox "Email o Teléfono" [invalid] [ref=e18]:
                    - /placeholder: ejemplo@email.com o +521234567890
                    - text: test@example.com
                - generic [ref=e19]: Credenciales inválidas
            - generic [ref=e20]:
                - button "Iniciar sesión" [ref=e21] [cursor=pointer]
                - paragraph [ref=e22]: "Usuarios de prueba: test@test.com, +521234567890"
    - alert [ref=e23]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  |
  3  | test.describe("Wallet Home Page", () => {
  4  |   test.describe("Given an authenticated user", () => {
  5  |     test.beforeEach(async ({ page }) => {
  6  |       await page.goto("/login");
  7  |       await page.fill('[data-testid="credential-input"]', "test@example.com");
  8  |       await page.click('[data-testid="login-button"]');
> 9  |       await page.waitForURL("/home");
     |                  ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  10 |     });
  11 |
  12 |     test.describe("When viewing the home page", () => {
  13 |       test("Then should display user profile information", async ({ page }) => {
  14 |         await expect(page.getByText(/buenos días|buenas tardes|buenas noches/i)).toBeVisible();
  15 |
  16 |         await expect(page.getByRole("heading")).toBeVisible();
  17 |       });
  18 |
  19 |       test("Then should display balance card", async ({ page }) => {
  20 |         await expect(page.getByText(/saldo disponible/i)).toBeVisible();
  21 |
  22 |         await expect(page.getByText(/\$/)).toBeVisible();
  23 |       });
  24 |
  25 |       test("Then should allow toggling balance visibility", async ({ page }) => {
  26 |         await page.click('[aria-label*="Ocultar saldo"]');
  27 |
  28 |         await expect(page.getByText("••••••")).toBeVisible();
  29 |
  30 |         await page.click('[aria-label*="Mostrar saldo"]');
  31 |
  32 |         await expect(page.getByText(/\$/)).toBeVisible();
  33 |       });
  34 |     });
  35 |
  36 |     test.describe("When the page loads", () => {
  37 |       test("Then should show loading skeletons initially", async ({ page }) => {
  38 |         await page.goto("/home");
  39 |
  40 |         const skeletons = page.locator('[data-loading="true"]');
  41 |
  42 |         await expect(skeletons.first()).toBeVisible();
  43 |       });
  44 |     });
  45 |   });
  46 |
  47 |   test.describe("Given an unauthenticated user", () => {
  48 |     test.describe("When trying to access home page", () => {
  49 |       test("Then should redirect to login", async ({ page }) => {
  50 |         await page.goto("/home");
  51 |
  52 |         await expect(page).toHaveURL("/login");
  53 |       });
  54 |     });
  55 |   });
  56 | });
  57 |
```
