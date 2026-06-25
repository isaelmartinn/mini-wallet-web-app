# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows/smoke.spec.ts >> Smoke Test >> Given the application is running >> When visiting the root page >> Then should display the app
- Location: e2e/flows/smoke.spec.ts:6:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Mini Wallet')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Mini Wallet')

```

```yaml
- alert
- heading "Iniciar sesión" [level=2]
- paragraph: Ingresa tu email o teléfono para continuar
- group:
    - text: Email o Teléfono
    - textbox "Email o Teléfono":
        - /placeholder: ejemplo@email.com o +521234567890
- button "Iniciar sesión"
- paragraph: "Usuarios de prueba: test@test.com, +521234567890"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  |
  3  | test.describe("Smoke Test", () => {
  4  |   test.describe("Given the application is running", () => {
  5  |     test.describe("When visiting the root page", () => {
  6  |       test("Then should display the app", async ({ page }) => {
  7  |         await page.goto("/");
> 8  |         await expect(page.getByText("Mini Wallet")).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  9  |       });
  10 |     });
  11 |   });
  12 | });
  13 |
```
