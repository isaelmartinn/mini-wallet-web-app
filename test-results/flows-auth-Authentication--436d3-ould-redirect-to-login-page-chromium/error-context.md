# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/auth.spec.ts >> Authentication Flow >> Given an authenticated user >> When logging out >> Then should redirect to login page
- Location: e2e/flows/auth.spec.ts:38:7

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
  3  | test.describe("Authentication Flow", () => {
  4  |   test.describe("Given a user on the login page", () => {
  5  |     test.beforeEach(async ({ page }) => {
  6  |       await page.goto("/login");
  7  |     });
  8  |
  9  |     test.describe("When entering valid credentials", () => {
  10 |       test("Then should redirect to home page", async ({ page }) => {
  11 |         await page.fill('[data-testid="credential-input"]', "test@example.com");
  12 |         await page.click('[data-testid="login-button"]');
  13 |
  14 |         await expect(page).toHaveURL("/home");
  15 |       });
  16 |     });
  17 |
  18 |     test.describe("When the login form is displayed", () => {
  19 |       test("Then should show all required elements", async ({ page }) => {
  20 |         await expect(
  21 |           page.getByRole("heading", { name: /iniciar sesión/i })
  22 |         ).toBeVisible();
  23 |         await expect(page.locator('[data-testid="credential-input"]')).toBeVisible();
  24 |         await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  25 |       });
  26 |     });
  27 |   });
  28 |
  29 |   test.describe("Given an authenticated user", () => {
  30 |     test.beforeEach(async ({ page }) => {
  31 |       await page.goto("/login");
  32 |       await page.fill('[data-testid="credential-input"]', "test@example.com");
  33 |       await page.click('[data-testid="login-button"]');
> 34 |       await page.waitForURL("/home");
     |                  ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  35 |     });
  36 |
  37 |     test.describe("When logging out", () => {
  38 |       test("Then should redirect to login page", async ({ page }) => {
  39 |         await page.click('[data-testid="logout-button"]');
  40 |
  41 |         await expect(page).toHaveURL("/login");
  42 |       });
  43 |     });
  44 |   });
  45 | });
  46 |
```
