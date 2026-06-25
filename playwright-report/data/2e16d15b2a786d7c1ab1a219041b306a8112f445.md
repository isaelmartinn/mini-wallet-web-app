# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/auth.spec.ts >> Authentication Flow >> Given a user on the login page >> When entering valid credentials >> Then should redirect to home page
- Location: e2e/flows/auth.spec.ts:10:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/home"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/login"

```

```yaml
- heading "Iniciar sesión" [level=2]
- paragraph: Ingresa tu email o teléfono para continuar
- group:
    - text: Email o Teléfono
    - textbox "Email o Teléfono" [invalid]:
        - /placeholder: ejemplo@email.com o +521234567890
        - text: test@example.com
    - text: Credenciales inválidas
- button "Iniciar sesión"
- paragraph: "Usuarios de prueba: test@test.com, +521234567890"
- alert
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
> 14 |         await expect(page).toHaveURL("/home");
     |                            ^ Error: expect(page).toHaveURL(expected) failed
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
  34 |       await page.waitForURL("/home");
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
