import { Page } from '@playwright/test';

const loginWith = async (page: Page, email: string, password: string) => {
    await page.goto('/login');
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Contraseña").fill(password);
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
}

export { loginWith };