import { test, expect } from "../fixtures";

// Flujo público: partimos sin sesión
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Autenticación (flujo público)", () => {
  test("CP-01 login exitoso redirige al dashboard", async ({
    page,
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    const email = process.env.E2E_ADMIN_EMAIL!;
    const password = process.env.E2E_ADMIN_PASSWORD!;

    // Act
    await loginPage.goto();
    await loginPage.login(email, password);

    // Assert
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.heading).toBeVisible();
  });

  test("CP-02 login con credenciales inválidas muestra alerta", async ({
    page,
    loginPage,
  }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login("noexiste@upc.edu.co", "claveIncorrecta123");

    // Assert
    await expect(loginPage.errorAlert).toContainText(
      /correo o contraseña incorrectos/i,
    );
    await expect(page).toHaveURL(/\/login/);
  });
});
