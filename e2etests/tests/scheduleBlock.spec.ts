import {test, expect} from '@playwright/test';
import {loginWith} from './helper';

test.beforeAll(async ({request}) => {
    await request.post('http://localhost:3001/api/testing/reset');
});

test.describe('Schedule Block Tests - CRUD operations', () => {

    test('Crear y leer bloque de horario', async ({page}) => {
        // Iniciar sesión como cliente válido
        await loginWith(page, "vicenteleyton@gmail.com", "vicenteleyton");

        // Navegar al perfil de un profesional
        await page.getByRole("link", {name: "Ver horario"}).first().click();

        // Seleccionar el primer bloque disponible
        await page.getByTitle("Día disponible").first().click();

        // Seleccionar primera hora disponible
        await page.getByRole("button", { name: "20:00 - 20:30" }).click();

        // Solicitar cita
        await page.getByRole("button", { name: "Solicitar Cita" }).click();

        // Cerrar bloque modal
        await page.getByRole("button", { name: "Cerrar" }).click();

        // Ahora verificar que el bloque de horario se ha creado correctamente
        await page.getByRole("button", { name: "20:00 - 20:30" }).click();
        await expect(page.getByText("pendiente")).toBeVisible();
    });

    test('Editar y eliminar bloque de horario', async ({page}) => {
        // Iniciar sesión como profesional válido
        await loginWith(page, "andres123@gmail.com", "andres123");

        // Navegar a perfil del profesional
        await page.getByRole("link", {name: "Editar mi horario"}).click();

        // Seleccionar el bloque creado previamente
        await page.getByTitle("Día disponible").first().click();
        await page.getByRole("button", { name: "20:00 - 20:30" }).click();

        // Rechazar la cita
        await page.getByRole("button", { name: "Rechazar" }).click();
        await page.getByRole("button", { name: "Cerrar" }).click();

        // Verificar que el bloque de horario ha sido cancelado
        await page.getByRole("button", { name: "20:00 - 20:30" }).click();
        await expect(page.getByText("cancelado")).toBeVisible();

        // Eliminar el bloque de horario
        await page.getByRole("button", { name: "Eliminar" }).click();
        await page.getByRole("button", { name: "Cerrar" }).click();

        // Verificar que el bloque de horario ha sido eliminado
        await page.getByRole("button", { name: "20:00 - 20:30" }).click();
        await expect(page.getByText("Estado:")).not.toBeVisible();
    });
});