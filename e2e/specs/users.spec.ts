import { test, expect } from "../fixtures";

test.describe("Gestión de usuarios (admin)", () => {
  test("CP-06 admin ve la lista de usuarios", async ({ usersPage }) => {
    // Arrange
    await usersPage.goto();

    // Assert
    await expect(usersPage.heading).toBeVisible();
    await expect(usersPage.table).toBeVisible({ timeout: 15_000 });
    await expect(usersPage.rows.first()).toBeVisible({ timeout: 15_000 });
  });

  test("CP-07 admin filtra usuarios por búsqueda", async ({ usersPage }) => {
    // Arrange
    await usersPage.goto();
    await expect(usersPage.table).toBeVisible({ timeout: 15_000 });

    // Act — búsqueda que NO debe coincidir con ningún usuario
    await usersPage.search("zzz-no-existe-zzz");

    // Assert — la tabla muestra el placeholder de "sin resultados"
    await expect(usersPage.table).toContainText(
      /no hay usuarios que coincidan/i,
      { timeout: 10_000 },
    );
  });
});

test.describe("Control de acceso por rol (RBAC)", () => {
  test.use({ storageState: "e2e/.auth/guard.json" });

  test("CP-08 guardia NO ve el enlace Usuarios en el sidebar", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);

    // Esperar a que useAuth termine (NavUser aparece solo cuando user !== null).
    // No dependemos del nombre exacto del guardia: basta con que el sidebar
    // haya aplicado el filter() por rol. Lo verificamos esperando que el link
    // "Visitantes" (permitido para guard) exista.
    await expect(page.getByRole("link", { name: /^visitantes$/i })).toBeVisible(
      { timeout: 15_000 },
    );

    // Act / Assert
    await expect(page.getByRole("link", { name: /^usuarios$/i })).toHaveCount(
      0,
    );
  });
});
