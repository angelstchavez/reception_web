import { test, expect } from "../fixtures";

test.describe("Gestión de usuarios (admin)", () => {
  test("CP-06 admin ve la lista de usuarios", async ({ usersPage }) => {
    // Arrange
    await usersPage.goto();

    // Act (solo carga) / Assert
    await expect(usersPage.heading).toBeVisible();
    await expect(usersPage.table).toBeVisible();
    await expect(usersPage.rows.first()).toBeVisible();
  });

  test("CP-07 admin filtra por rol Estudiantes", async ({ usersPage }) => {
    // Arrange
    await usersPage.goto();
    await expect(usersPage.table).toBeVisible();

    // Act
    await usersPage.filterByRole("Estudiantes");

    // Assert
    // Verifica que las filas visibles tienen rol Estudiante (o Estudiante badge)
    await expect(usersPage.rows.first()).toContainText(/estudiante/i);
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

    // Act / Assert
    await expect(page.getByRole("link", { name: /^usuarios$/i })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("link", { name: /^visitantes$/i }),
    ).toBeVisible();
  });
});

test.skip("DEBUG ver estructura de tabs", async ({ usersPage, page }) => {
  await usersPage.goto();
  await page.waitForLoadState("networkidle");

  const tabRole = await page.getByRole("tab").count();
  const tablistRole = await page.getByRole("tablist").count();
  const textos = await page.locator('[role="tablist"] *').allTextContents();

  console.log({ tabRole, tablistRole, textos });
});
