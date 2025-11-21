import { test, expect } from '@playwright/test';
import { loginWith } from './helper';

test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
});

test.describe("AbbaSchedule Login Tests", () => {
    test("Login con usuario válido", async ({ page }) => {
        // Iniciar sesión como usuario válido
        await loginWith(page, "angeloherrera@gmail.com", "angeloherrera");

        // Verificar que el login fue exitoso
        await expect(page.getByText("Bienvenido angelo herrera")).toBeVisible();
    });
    test("Login con usuario inválido", async ({ page }) => {
        // Iniciar sesión como usuario inválido
        await loginWith(page, "usuario@invalido.com", "contraseñainvalida");

        // Verificar que el login falló
        await expect(page.getByText("Correo o contraseña inválidos")).toBeVisible();
    });
    test("Verificar que no se puede acceder a una página protegida sin iniciar sesión", async ({ page, request }) => {
        // Navegar a la página home con una id de usuario cualquiera
        await page.goto(`/home/my-id`);

        // Verificar que se redirige a la página de login
        await expect(page).toHaveURL(/.*\/login/);
    });
});
