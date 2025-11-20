import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
});

test.describe("AbbaSchedule Login Tests", () => {
    test("Login con usuario válido", async ({ page }) => {
        await page.goto("/login");

        await page.getByPlaceholder("Email").fill("angeloherrera@gmail.com");
        await page.getByPlaceholder("Contraseña").fill("angeloherrera");
        await page.getByRole("button", { name: "Iniciar sesión" }).click();

        await expect(page.getByText("Bienvenido angelo herrera")).toBeVisible();
    });
    test("Login con usuario inválido", async ({ page }) => {
        await page.goto("/login");

        await page.getByPlaceholder("Email").fill("usuario@invalido.com");
        await page.getByPlaceholder("Contraseña").fill("contraseñainvalida");
        await page.getByRole("button", { name: "Iniciar sesión" }).click();

        await expect(page.getByText("Correo o contraseña inválidos")).toBeVisible();
    });
});
